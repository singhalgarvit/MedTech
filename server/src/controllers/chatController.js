import chatService from "../services/chatService.js";

const sendQuery = async (req, res) => {
  try {
    const data = await chatService.generateResponse(req.body.query);
    res.status(200).json({msg: data});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
};

export default {sendQuery};
