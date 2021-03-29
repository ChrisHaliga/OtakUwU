const chai = require('chai');
const expect = require('chai').expect;
const request = require('supertest');
const server = require('../Backend/server')
const Platform = require('../Backend/models/platform.model');
const mongoose = require('mongoose');

var mockId = mongoose.Types.ObjectId();

describe("/GET platform", function () {

    it("returns a 200 success", done => {
    request(server)
        .get('/platforms')
        // .expect(200, done)
        .then((res)=>{
            expect(res.statusCode).to.equal(200);
            // expect(res.body).to.include(insertedData)
            done()
        })
        .catch((err) => done(err))
    })
});

describe("/POST platform", function () {
    it("returns a 200 success", done => {
    request(server)
        .post('/platforms/add')
        .send(
            {
                websiteName: "testPlatform2",
                link: "testPlatform2.com",
                icon: "test-platform-icon2"
            }
        )
        .expect(200)
        .then((res)=>{
            expect(res.body).to.include("Platform added");
            Platform.find()
            .then(function(platforms) {
                platforms => platforms.filter(p => p.websiteName == "testPlatform2");
                expect(platforms).to.not.be.empty;
                expect(platforms[0].websiteName).to.equal("testPlatform2");
            })
            done()
        })
        .catch((err) => done(err))
    });
});

describe("/Delete platform", function () {
    //post object
    request(server)
    .post('/platforms/add')
    .send(
        {
            websiteName: "platformToDelete",
            link: "platformToDelete.com",
            icon: "platform-to-delete-icon"
        }
    )

    var platformToDelete = new Platform();
    Platform.find()
        .then(function(platforms) 
        {
            platformToDelete = platforms.find(p => p.websiteName == "platformToDelete");
            expect(platformToDelete.websiteName).to.be("platformToDelete");
        })
    it("returns 200 and Platform deleted + id", done => {
        request(server)
        .delete('/platforms/'+ platformToDelete.id)
        .expect(200)
        .then(function(res) {
            expect(res.body).to.include("Platform deleted!")
            expect(res.body).to.include(platformToDelete.id)
            done()
        })
        .catch((err) => done(err));
    });  
});