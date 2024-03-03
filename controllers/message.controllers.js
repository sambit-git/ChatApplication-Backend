import customErrorResponse from "../utilities/exception_response.utility.js";

import Message from "../models/message.models.js";
import User from "../models/user.models.js";
import Chat from "../models/chat.models.js";

export const sendMessage = async (req, res, next) => {
  const { chatId, content } = req.body;

  if (!chatId || !content)
    return next(
      customErrorResponse(
        400,
        "Bad Request! chatId or/and message value(s) are not provided!"
      )
    );

  try {
    let message = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });
    message = await message.populate("sender", "fullName photo");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.status(200).json(message);
  } catch (error) {
    return next(error);
  }
};

export const fetchMessages = async (req, res, next) => {
  const chatId = req.params.chatId;
  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "fullName photo email")
      .populate("chat");
    res.status(200).json(messages);
  } catch (error) {
    return next(error);
  }
};
