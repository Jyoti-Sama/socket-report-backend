const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const { createReport, getAllReport, editReport, deleteReport } = require('./controller/report');
const path = require('path');
const router = require('./routers/router');

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', router);


io.on('connection', (socket) => {

  //create new report
  socket.on('report data', (data) => {

    const { name, reportDetails, reportTitle, images } = JSON.parse(data);
    console.log(name, reportDetails, reportTitle, images);

    createReport(name, reportDetails, reportTitle, images)
      .then((response) => {
        console.log(response);
        io.emit('report data', data);
        io.emit('response data', { message: "data saved to database!", status: 200 });
      })
      .catch(error => {
        console.log(error);
        io.emit('response data', { message: error, status: 401 });
      })
  });

  //get all report
  socket.on('getAllReports', (data, cb) => {
    console.log("fired")
    getAllReport()
      .then((response) => {
        console.log(response)
        io.emit('get all report data', response);
        cb(response)
        io.emit('response data', { message: "fetched data from database!", status: 200 });
      })
      .catch(error => {
        console.log(error);
        io.emit('response data', { message: error, status: 401 });
      })

    // io.emit('response data', {message: "fetched all reports!"});
  });

  //edit report
  socket.on('edit report data', (data) => {
    console.log("edit fired", data);

    const { _id, name, reportDetails, reportTitle } = JSON.parse(data);

    editReport(_id, name, reportDetails, reportTitle)
      .then((response) => {
        console.log(response)
        io.emit('edit report data', response);
        io.emit('response data', { message: "report edited!", status: 200 });
      })
      .catch(error => {
        console.log(error);
        io.emit('response data', { message: error, status: 401 });
      })
  });

  //delete report
  socket.on('delete report', (data) => {
    console.log("delete fired", data);

    deleteReport(data)
      .then((response) => {
        console.log(response)
        io.emit('delete report', response);
        io.emit('response data', { message: "report deleted!", status: 200 });
      })
      .catch(error => {
        console.log(error);
        io.emit('response data', { message: error, status: 401 });
      })
  });
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`listening on : ${PORT}`);
    });
  })
  .catch(err => console.log("db connection failed", err))

