const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', apiRoutes);

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced successfully.');
  app.listen(PORT, () => {
    console.log(`GearGuard Backend running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});