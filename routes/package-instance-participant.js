import express from 'express';
import InstanceParticipants from '../models/package-instance-participant';

const router = express.Router();

router.get('/:instId', function(req, res) {
  const instId = req.params.instId;
  console.log('>>>>Retrieve package-item by itemId', itemId);
  InstanceParticipants.getParticipantByInstId(instId)
    .then((result) => {
      console.log('>>>>Retrieved package-item participant', result);
      res.send(result);
    })
});

router.put('/', function(req, res) {
  console.log('>>>>Insert package-instance participant', req.body);
  const {instId, userId} = req.body;

  InstanceParticipants.addParticipant(instId, userId)
    .then((result) => {
      console.log('>>>>Inserted package-instance participant', result);
      res.send(result);
    })
});

router.post('/', function(req, res) {
  console.log('>>>>Post package-instance participant', req.body);
  const {instId, userId} = req.body;

  InstanceParticipants.addParticipant(instId, userId)
    .then((result) => {
      console.log('>>>>Inserted package-instance participant', result);
      res.send(result);
    })
});

router.delete('/', function(req, res) {
  console.log('>>>>Delete package-instance participant', req.body);
  const {InstId} = req.body;

  InstanceParticipants.delParticipant(InstId)
    .then(() => {
      console.log('>>>>Deleted package-instance participant for instance['+InstId+']');
      res.send('ok');
    })
});

export default router;
