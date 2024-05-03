'use strict';

const swapiUrl = process.env.SWAPI_URL;
const uri = 'api/people/';
const axios = require('axios');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
});

module.exports.getPeopleAllFromDatabase = async (event, context) => {
  try {
    const response = await new Promise((resolve, reject) => {
      connection.query('SELECT id, name, gender FROM people', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: error.response.status || 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

module.exports.getPeopleByIdFromDatabase = async (event, context) => {
  try {
    const { id } = event.pathParameters;
    const response = await new Promise((resolve, reject) => {
      connection.query('SELECT id, name, gender FROM people WHERE id = ?', [id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: error.response.status || 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

module.exports.createPeopleFromDatabase = async (event, context) => {
  try {
    const { name, gender } = event.body;
    const response = await new Promise((resolve, reject) => {
      connection.query('INSERT INTO people (name, gender) VALUES (?, ?)', [name, gender], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: error.response.status || 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

module.exports.getPeopleAllFromSwapi = async (event, context) => {
  try {
    const url = `${swapiUrl}${uri}`;
    const response = await axios.get(url);
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: error.response.status || 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

module.exports.getUserByIdFromSwapi = async (event, context) => {
  try {
    const { id } = event.pathParameters;
    const url = `${swapiUrl}${uri}${id}`;
    const response = await axios.get(url);
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
