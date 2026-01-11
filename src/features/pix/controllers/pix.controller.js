export class PixController {

  constructor({ pixService }) {
    this.pixService = pixService;
  }

  async getParticipantsByIspb(req, res) {
    const { ispb } = req.params;
    const participant = await this.pixService.getParticipantsByIspb(ispb);

    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    res.json(participant);
  }
}

