// Setup and configuration
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to monogodb
mongoose.connect('mongodb://localhost:27017/DailyJournal', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

// Creating schema and default items
const journalEntrySchema = {
	title: String,
	entry: String,
};

// Create db
const JournalEntry = mongoose.model('Entry', journalEntrySchema);

// Default home, about, contact paragraph text
const homeParagraph = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
incididunt ut labore et dolore magna aliqua. Dolor sit amet consectetur adipiscing. Purus in massa 
tempor nec feugiat nisl. Neque egestas congue quisque egestas diam in. Vel facilisis volutpat est 
velit egestas dui id ornare. Cursus turpis massa tincidunt dui. Faucibus pulvinar elementum integer 
enim neque volutpat ac. Morbi non arcu risus quis varius quam quisque id. Erat nam at lectus urna 
duis convallis. Et netus et malesuada fames. Pellentesque id nibh tortor id aliquet lectus. 
Elementum integer enim neque volutpat ac.`;

const aboutParagraph = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
tempor incididunt ut labore et dolore magna aliqua. Urna molestie at elementum eu facilisis. 
Sit amet cursus sit amet dictum sit amet justo. Nisl nunc mi ipsum faucibus vitae aliquet nec 
ullamcorper sit. Pharetra magna ac placerat vestibulum lectus mauris. Massa enim nec dui nunc mattis. 
Tristique risus nec feugiat in fermentum. Etiam tempor orci eu lobortis elementum nibh tellus molestie. 
Ligula ullamcorper malesuada proin libero nunc consequat interdum varius sit. Lorem dolor sed 
viverra ipsum nunc aliquet bibendum. Volutpat diam ut venenatis tellus in metus vulputate eu. 
Quam viverra orci sagittis eu volutpat odio. Elementum eu facilisis sed odio morbi.`;

const contactParagraph = `Pellentesque dignissim enim sit amet venenatis. Gravida neque convallis a 
cras semper auctor. Arcu non sodales neque sodales ut. Est placerat in egestas erat imperdiet sed 
euismod nisi. Amet mauris commodo quis imperdiet. Neque egestas congue quisque egestas diam in arcu 
cursus. Tellus elementum sagittis vitae et leo duis ut. Sollicitudin nibh sit amet commodo nulla f
acilisi nullam. Commodo nulla facilisi nullam vehicula ipsum a. Dignissim cras tincidunt lobortis 
feugiat vivamus at. Aliquet lectus proin nibh nisl condimentum id venenatis a condimentum. Aenean 
euismod elementum nisi quis eleifend quam adipiscing.`;

// Go to requested pages
app.get('/', function (req, res) {
	JournalEntry.find({}, function (err, journalEntries) {
		res.render('homepage', {
			homeParagraph: homeParagraph,
			postTitle: journalEntries,
			post: journalEntries,
		});
	});
});

app.get('/compose', function (req, res) {
	res.render('compose');
});

app.get('/contact', function (req, res) {
	res.render('contact', { contactParagraph: contactParagraph });
});

app.get('/about', function (req, res) {
	res.render('about', { aboutParagraph: aboutParagraph });
});

// Route to full post page
app.get('/post/:postTitle', function (req, res) {
	let format = req.params.postTitle;
	let x = postTitle.includes(format);

	JournalEntry.findOne({ title: format }, function (err, foundList) {
		// find value in db and render if found
		if (foundList) {
			res.render('postPage', {
				homeParagraph: homeParagraph,
				postTitle: foundList,
				post: foundList,
			});
		} else {
			res.render('error');
		}
	});
});

// Clear all values in db
app.get('/clear', function (req, res) {
	JournalEntry.deleteMany({}, function (err) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

// Get information from text boxes and save in db
app.post('/', function (req, res) {
	let postTitles = req.body.postTitle;
	let posts = req.body.postVal;

	const entry = new JournalEntry({
		title: postTitles.toString(),
		entry: posts.toString(),
	});
	entry.save();
	res.redirect('/');
});

// 404 page
app.get('*', function (req, res) {
	res.render('error');
});

app.listen(3000, function () {
	console.log('Server started on port 3000');
});
