import customErrorResponse from "../utilities/exception_response.utility.js";
import Chat from "../models/chat.models.js";
import User from "../models/user.models.js";

export const ontToOneChat = async (req, res, next) => {
  const { userId } = req.body;

  if (!userId)
    return next(customErrorResponse(400, "Bad Request! Requires userId"));
  try {
    let userChat = await Chat.findOne({
      isGroupChat: false,
      $and: [{ users: { $all: [req.user._id, userId] } }],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (userChat) {
      userChat = await User.populate(userChat, {
        path: "latestMessage.sender",
        select: "fullName photo email",
      });
      res.status(200).json(userChat);
    } else {
      const newChat = await Chat.create({
        chatName: "OneToOne",
        isGroupChat: false,
        users: [req.user.id, userId],
      });
      const fullChat = await Chat.find({ _id: newChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(fullChat);
    }
  } catch (error) {
    return next(error);
  }
};

export const fetchAllChats = async (req, res, next) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("admin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "fullName email photo",
    });
    res.json(chats);
  } catch (error) {
    return next(error);
  }
};

export const createGroup = async (req, res, next) => {
  const { chatName, users, photo } = req.body;
  if (!chatName || !users)
    return next(
      customErrorResponse(400, "Bad Request! chatName & users are required!")
    );
  try {
    users.push(req.user);
    const groupChat = await Chat.create({
      chatName,
      isGroupChat: true,
      users,
      admin: req.user,
      photo: photo,
    });
    const response = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("admin", "-password");
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const renameGroup = async (req, res, next) => {
  const { chatName, id } = req.body;
  if (!chatName || !id)
    return next(
      customErrorResponse(400, "Bad Request! chatName & id are required!")
    );
  try {
    const group = await Chat.findByIdAndUpdate(id, { chatName }, { new: true })
      .populate("users", "-password")
      .populate("admin", "-password");
    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};

export const addToGroup = async (req, res, next) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId)
    return next(
      customErrorResponse(400, "Bad Request! chatId & userId are required!")
    );
  try {
    const group = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("admin", "-password");
    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};
export const removeFromGroup = async (req, res, next) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId)
    return next(
      customErrorResponse(400, "Bad Request! chatId & userId are required!")
    );
  try {
    const group = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("admin", "-password");
    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};
