module.exports = function getReceiverInfo(participants, senderId) {
  return participants.find(p => p.participantId.toString() !== senderId.toString());
};
