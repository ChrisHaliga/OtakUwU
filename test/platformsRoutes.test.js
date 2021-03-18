const request = require("supertest");
const app = require("../Backend/server");
const chai = require('chai');
const { expect } = require("chai");
const mongoose = require('mongoose');

var mockId = mongoose.Types.ObjectId();

describe("/GET platform", function () {
    it("returns a 200 success", done => {
    request(app)
        .get('/platforms')
        .expect(200, done);
    });
})

describe("/POST platform", function () {
    it("returns a 200 success", done => {
    request(app)
        .post('/platforms/add')
        .send(
            {
                id: mockId,
                websiteName: "testSite",
                link: "testSite.com",
                icon: "test_site_icon"
            }
        )
        .expect(200)
        .expect("Platform added", done);
    });
});



describe("/GET platform by name", function () {
    var isTestPlatform = function(res) {
        expect(res.body).to.exist;
        expect(res.body).to.have.property('websiteName','testSite');
        expect(res.body).to.have.property('link','testSite.com');
        expect(res.body).to.have.property('icon','test_site_icon');
    };

    it("returns a 200 success", done => {
    request(app)
    .get('/platforms/testSite')
    .expect(function(res) {
        res.body.id = res.body.id;
        res.body.websiteName = res.body.websiteName;
      })
    .expect(isTestPlatform)
    .expect(200, done);
    });
});

describe("/Delete platform", function () {
    var websiteId = mockId;     
    it("returns a 200 success", done => {
    request(app)
        .delete(`/platforms/${websiteId}`)
        .expect(200)
        .expect("Platform deleted.", done);
    })  
});