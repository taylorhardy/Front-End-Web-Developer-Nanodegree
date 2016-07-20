/*
 This is empty on purpose! Your code to build the resume will go here.
 */

var bio = {
	"name": "Taylor Hardy",
	"role": "Web Applications Developer",
	"welcomeMessage": "Welcome!",
	"contacts": {
		"mobile": "918-813-3654",
		"email": "Taylor.hardy177@gmail.com",
		"githublink": "https://github.com/taylorhardy",
		"github": "TaylorHardy",
		"twitter": "",
		"location": "Tulsa, Oklahoma"
	},
	"skills": ["HTML", "Javascript", "Angular.js", "Python", "Node.js", "SQL", "Swift"],
	"biopic": "images/fry.jpg"
};

var education = {
	"schools": [{
		"name": "Tulsa Community College",
		"location": "Tulsa Oklahoma",
		"degree": "Associates in Applied Science - in progress",
		"majors": ["Programming"],
		"dates": "01/01/16 - 05/01/18",
		"url": "https://www.tulsaCC.edu"
	}],
	"onlineCourses": [{
		"title": "Full Stack Web Developer",
		"school": "Udacity",
		"date": "05/16",
		"url": "https://www.udacity.com"
	}]
};

var work = {
	"jobs": [{
		"employer": "DIRECTV",
		"title": "Online Learning Specialist",
		"dates": "04/14 - Present",
		"description": "Create web applications that aid in the productivity of the Learning and Development Department functions.",
		"location": "Tulsa, OK",
		"images": ["images/197x148.gif"]
	}, {
		"employer": "DIRECTV",
		"title": "Employee Development Coach",
		"dates": "04/13 - 04/14",
		"description": "Coach and mentor new hire agents to be success in a call center enviroment, meeting or exceeding company goals.",
		"location": "Tulsa, OK",
		"images": ["images/197x148.gif"]
	}]
};

var projects = {
	"projects": [{
		"title": "Conference Organization app",
		"dates": "03/16",
		"description": "The conference organization app was built using highly scalable endpoints provided by Googles App Engine. With this app users can register with the app using their google account and create events and mark as attending. Sessions can be also be deleted and all be displayed",
		"images": ["images/197x148.gif"]
	}, {
		"title": "Catalog Application",
		"dates": "03/16",
		"description": "An application that provides a list of items within a variety of categories as well as provide a user registration and authentication system. Registered users will have the ability to post, edit and delete their own items.",
		"images": ["images/197x148.gif"]
	},{
		"title": "MemeMe",
		"dates": "06/16",
		"description": "An IOS application that allows the user to place text over an image and share it via the native share menu.",
		"images": ["images/197x148.gif"]
	}]
};
// functions to display data from JSON objects

bio.display = function () {
	'use strict';
	var formattedName = HTMLheaderName.replace("%data%", bio.name);
	var formattedRole = HTMLheaderRole.replace("%data%", bio.role);
	var formattedBioPic = HTMLbioPic.replace("%data%", bio.biopic);
	var formattedWelcomeMsg = HTMLwelcomeMsg.replace("%data%", bio.welcomeMessage);

	var formattedContactInformation = [];
	formattedContactInformation.push(HTMLemail.replace("%data%", bio.contacts.email));
	formattedContactInformation.push(HTMLgithub.replace("%data%", bio.contacts.github));
	formattedContactInformation.push(HTMLtwitter.replace("%data%", bio.contacts.twitter));
	formattedContactInformation.push(HTMLlocation.replace("%data%", bio.contacts.location));


	$("#header").prepend(formattedRole);
	$("#header").prepend(formattedName);
	$("#header").append(formattedBioPic);
	$("#header").append(formattedWelcomeMsg);

	if(bio.skills.length) {
		$("#header").append(HTMLskillsStart);

		for(var i = 0; i <  bio.skills.length; i++) {
			$("#skills").append(HTMLskills.replace("%data%", bio.skills[i]));
		}
	}

	for(var i = 0; i < formattedContactInformation.length; i++) {
		$("#topContacts").append(formattedContactInformation[i]);
		$("#footerContacts").append(formattedContactInformation[i]);
	}

};

education.display = function () {
	'use strict';
	if(education.schools.length|| education.onlineCourses.length) {
		for(var i = 0; i <  education.schools.length; i++) {
			$("#education").append(HTMLschoolStart);

			var formattedSchoolName = HTMLschoolName.replace("%data%", education.schools[i].name).replace("#", education.schools[i].url);
			var formattedSchoolDegree = HTMLschoolDegree.replace("%data%", education.schools[i].degree);
			var formattedSchoolDates = HTMLschoolDates.replace("%data%", education.schools[i].dates);
			var formattedSchoolLocation = HTMLschoolLocation.replace("%data%", education.schools[i].location);
			var formattedSchoolMajor = HTMLschoolMajor.replace("%data%", education.schools[i].majors);


			$(".education-entry:last").append(formattedSchoolName + formattedSchoolDegree);
			$(".education-entry:last").append(formattedSchoolDates);
			$(".education-entry:last").append(formattedSchoolLocation);
			$(".education-entry:last").append(formattedSchoolMajor);
		}

		if(education.onlineCourses.length) {
			$("#education").append(HTMLonlineClasses);
			for(var i = 0; i < education.onlineCourses.length; i++) {
				$("#education").append(HTMLschoolStart);
				var formattedOnlineTitle = HTMLonlineTitle.replace("%data%", education.onlineCourses[i].title).replace("#", education.onlineCourses[i].url);
				var formattedOnlineSchool = HTMLonlineSchool.replace("%data%", education.onlineCourses[i].school);
				var formattedOnlineDate = HTMLonlineDates.replace("%data%", education.onlineCourses[i].date);
				var formattedOnlineURL = HTMLonlineURL.replace("%data%", education.onlineCourses[i].url).replace("#", education.onlineCourses[i].url);

				$(".education-entry:last").append(formattedOnlineTitle + formattedOnlineSchool);
				$(".education-entry:last").append(formattedOnlineDate);
				$(".education-entry:last").append(formattedOnlineURL);
			}
		}

	}
};

work.display = function () {
	'use strict';
	if(work.jobs.length) {

		$("#workExperience").append(HTMLworkStart);

		for(var i = 0; i <  work.jobs.length; i++) {
			var formattedEmployer = HTMLworkEmployer.replace("%data%", work.jobs[i].employer);
			var formattedWorkTitle = HTMLworkTitle.replace("%data%", work.jobs[i].title);
			var formattedWorkLocation = HTMLworkLocation.replace("%data%", work.jobs[i].location);
			var formattedDatesWorked = HTMLworkDates.replace("%data%", work.jobs[i].dates);
			var formattedWorkDescription = HTMLworkDescription.replace("%data%", work.jobs[i].description);

			var formattedEmployerWorkTitle = formattedEmployer + formattedWorkTitle;

			$(".work-entry:last").append(formattedEmployerWorkTitle);
			$(".work-entry:last").append(formattedWorkLocation);
			$(".work-entry:last").append(formattedDatesWorked);
			$(".work-entry:last").append(formattedWorkDescription);
		}

	}

};


projects.display = function () {
	'use strict';
	var proj;
	$("#projects").append("<div id=\"projects-foldable-content\"></div>");
	for (proj in projects.projects) {
		if (projects.projects.hasOwnProperty(proj)) {
			$("#projects-foldable-content").append(HTMLprojectStart);
			$(".project-entry:last").append(HTMLprojectTitle.replace("%data%", projects.projects[proj].title));
			$(".project-entry:last").append(HTMLprojectDates.replace("%data%", projects.projects[proj].dates));
			$(".project-entry:last").append(HTMLprojectDescription.replace("%data%", projects.projects[proj].description));
			if (projects.projects[proj].images.length > 0) {
				$(".project-entry:last").append(HTMLprojectImage.replace("%data%", projects.projects[proj].images[0]));
			}
		}
	}
};


//run display functions
bio.display();
education.display();
work.display();
projects.display();
$("#mapDiv").append(googleMap);