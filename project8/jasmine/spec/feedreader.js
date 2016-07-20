/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function () {
	/* This is our first test suite - a test suite just contains
	 * a related set of tests. This suite is all about the RSS
	 * feeds definitions, the allFeeds variable in our application.
	 */
	describe('RSS Feeds', function () {
		/* This is our first test - it tests to make sure that the
		 * allFeeds variable has been defined and that it is not
		 * empty. Experiment with this before you get started on
		 * the rest of this project. What happens when you change
		 * allFeeds in app.js to be an empty array and refresh the
		 * page?
		 */
		it('are defined', function () {
			expect(allFeeds).toBeDefined();
			expect(allFeeds.length).not.toBe(0);
		});


		/*  Write a test that loops through each feed
		 * in the allFeeds object and ensures it has a URL defined
		 * and that the URL is not empty.
		 */

		it('All items have a URL', function () {
			allFeeds.forEach(function (feed) {
				expect(feed.url).toBeDefined();
				expect(feed.url).not.toBe('');
			});
		});

		/*  Write a test that loops through each feed
		 * in the allFeeds object and ensures it has a name defined
		 * and that the name is not empty.
		 */

		it('Has a name', function () {
			allFeeds.forEach(function (feed) {
				expect(feed.name).toBeDefined();
				expect(feed.name).not.toBe('');
			});
		});
	});


	/*  Write a new test suite named "The menu" */
	describe('The menu', function () {
		var body = $('body'),
			menuIcon = $('.menu-icon-link');

		/* TODO: Write a test that ensures the menu element is
		 * hidden by default. You'll have to analyze the HTML and
		 * the CSS to determine how we're performing the
		 * hiding/showing of the menu element.
		 */
		it('hidden by default', function () {
			expect(body.hasClass('menu-hidden')).toBe(true);
		});

		/* TODO: Write a test that ensures the menu changes
		 * visibility when the menu icon is clicked. This test
		 * should have two expectations: does the menu display when
		 * clicked and does it hide when clicked again.
		 */
		it('Toggle view', function () {
			var body = document.body;
			menuIcon.click();
			expect(body.className).not.toContain("menu-hidden");

			menuIcon.click();
			expect(body.className).toContain("menu-hidden");
		});
		expectedClass = (body.hasClass('menu-hidden')) ? '' : 'menu-hidden';
	});
	/*  Write a new test suite named "Initial Entries" */

	describe('Initial entries', function () {
		beforeEach(function (done) {
			loadFeed(0, function () {
				done();
			});
		});

		/*  Write a test that ensures when the loadFeed
		 * function is called and completes its work, there is at least
		 * a single .entry element within the .feed container.
		 * Remember, loadFeed() is asynchronous so this test will require
		 * the use of Jasmine's beforeEach and asynchronous done() function.
		 */
		it('have at least a single entry', function (done) {
			var num = $('.feed .entry').length;
			console.log(num);
			expect(num).toBeGreaterThan(0);
			done();
		});
	});


	/*  Write a new test suite named "New Feed Selection" */

	describe('New feed selection', function () {
		var firstFeed;
		var secondFeed;

		beforeEach(function(done) {
			loadFeed(1, function() {
				firstFeed = $('.feed').html();
				loadFeed(2, function() {
					done();
				});
			});
		});

		//afterEach to reload first entry
		afterEach(function() {
			loadFeed(0);
		});
		/*  Write a test that ensures when a new feed is loaded
		 * by the loadFeed function that the content actually changes.
		 * Remember, loadFeed() is asynchronous.
		 */
		it('it changes the content', function() {
			expect(firstFeed).toBeDefined();
			secondFeed = $('.feed').html();
			expect(secondFeed).toBeDefined();
			expect(firstFeed).not.toEqual(secondFeed);
		});
	});
	}());
