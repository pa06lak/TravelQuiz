
const request = require('supertest');
const app = require('./app');
const fs = require('fs');
const path = require('path');


describe('Test the travel quiz', () => {
    // 1. API Destinations Searching Testing
    test('Should return a 200 response for /api/destinations', () => {
        return request(app)
	    .get('/api/destinations')
	    .expect(200);
    });
    test('Should return a 200 response and JSON destinations for 1 and 2 for /api/destinations', () => {
        return request(app)
	    .get('/api/destinations?ids=1,2')
	    .expect(200)
        .expect('Content-Type', /json/)
    });
    test('Should return a 200 response and JSON array when no IDs are provided ', () => {
        return request(app)
	    .get('/api/destinations')
	    .expect(200)
        .expect([])
    });
    test('Should return an empty array for the IDs that do not exist', () => {
        return request(app)
	    .get('/api/destinations?ids=999, 1000')
	    .expect(200)
        .expect([])
    });
    test('Should handle invalid ID formats gracefully', () => {
        return request(app)
	    .get('/api/destinations?ids=invalidID, 1000')
	    .expect(200)
    });




    
    // 2. API Destinations Listing Searching
    test('Should return a 200', () => {
        return request(app)
	    .get('/api/destinationsRead')
	    .expect(200)
    });
    test('Should return an error if the destinations file contains invalid JSON', () => {
        //This is the resource I have referenced for this: "https://stackoverflow.com/questions/63977366/how-to-mock-fs-readfilesync-with-jest"
        jest.spyOn(fs, 'readFile').mockImplementationOnce((filePath, encoding, callback) => {
            callback(null, 'invalid JSON');
        });
        return request(app)
            .get('/api/destinationsRead')
            .expect(500)
            .then((response) => {
                expect(response.text).toContain('Unexpected token');
            });
    });
    test('Should return 500 if fs.readFile fails', () => {
        const filePath = path.join(__dirname, 'Assets/destinations.json');
        fs.readFile.mockImplementationOnce((filePath, encoding, callback) => {
            callback(new Error('Error reading destinations file'));
        });

        return request(app)
            .get('/api/destinationsRead')
            .expect(500)
            .then((response) => {
                expect(response.text).toBe('Error reading destinations file'); // Verify the error message.
            });
    });




    
    // 3. API Rating Update
    test('Should return a 400 if the request body is missing a destinationName or userRating', () => {
        return request(app)
           .post('/api/update-rating')
           .send({})
           .expect(400);
    });
    test('Should return a 404 if the destinationName provided does not exist', () => {
        return request(app)
           .post('/api/update-rating')
           .send({ destinationName: 'Not a real destination', userRating: 5 })
           .expect(404);
    });
    test('Should return a message valid request - Rating updated successfully', () => {
        const destinationName = 'Paris';
        const userRating = 4.5;
    
        return request(app)
          .post('/api/update-rating')
          .send({ destinationName, userRating })
          .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Rating updated successfully');
            expect(response.body.destination.rating).toBeGreaterThan(0);
            expect(response.body.destination.count).toBeGreaterThan(0);
          });
      });
    test('Should return a message invalid request - Missing userRating', () => {
        return request(app)
          .post('/api/update-rating')
          .send({ destinationName: 'Paris' })
          .then(response => {
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid request payload');
          });
      });
    





      // 4. API Question Count Update
    test('Should return a 400 if the request body is missing an id', () => {
        return request(app)
           .post('/api/update-count')
           .send({})
           .expect(400);
    });
    test('Should return a 404 if the id provided does not exist', () => {
        return request(app)
           .post('/api/update-count')
           .send({ id: 'Not a real id' })
           .expect(404);
    });
    test('Should return 500 if file reading fails', () => {
        // Simulate file reading error
        fs.readFile.mockImplementationOnce((filePath, encoding, callback) => {
          callback(new Error('File read error'), null);
        });
        const requestBody = { id: '1' };
        return request(app)
          .post('/api/update-count')
          .send(requestBody)
          .expect(500)
          .then((response) => {
            expect(response.body.message).toBe('Error reading file');
          });
      });
    test('Should return 500 if JSON parsing fails', () => {
        fs.readFile.mockImplementationOnce((filePath, encoding, callback) => {
          callback(null, 'invalid JSON data');
        });
        const requestBody = { id: '1' };
        return request(app)
          .post('/api/update-count')
          .send(requestBody)
          .expect(500)
          .then((response) => {
            expect(response.body.message).toBe('Error parsing JSON');
        });
    });
    test('Should return 200 if question count is updated successfully', () => {
        const requestBody = { id: 'plane' };
        return request(app)
         .post('/api/update-count')
         .send(requestBody)
         .expect(200)
         .then((response) => {
            expect(response.body.message).toBe('Count updated successfully');
            expect(response.body.question.count).toBeGreaterThan(0);
          });
  
    });

      




      // 5. API Listing Questions from JSON
      test('Should return a 200', () => {
        return request(app)
         .get('/api/questions')
         .expect(200)
      });
      test('Should return an error if the questions file contains invalid JSON', () => {
        // Simulate file reading error
        fs.readFile.mockImplementationOnce((filePath, encoding, callback) => {
          callback(new Error('File read error'), null);
        });
    });
    
});