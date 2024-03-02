
const Provider = require("../models/Provider").Provider
const Student = require("../models/Provider").Student
const https = require("https");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

//NEW | GET
// render a new form
const newForm = (req,res) => {

};

//CREATE | POST
// manipulate data
const create = async(req, res) => {

};

//INDEX | GET
// render the home page with indexed students
const index = async(req,res) => {
    try{
        const providers = await Provider.find();
        
        res.render('index.ejs', {providers});
    }
    catch(err) {
        console.log(err);
    }
}

//SHOW

// SEED | GET
// send seed data for display & deletion confirming database access
// Seed function
const seed = async (req, res) => {
    try{
        // add some dummy data into the database
        const provider = await Provider.create(
            [
            {
                firstName: "John",
                lastName: "Doe",
                email: "your_email@example.com",
                students: [
                    {
                        name: "Alice",
                        targetSound: "k",
                        grade: "Kindergarten",
                        age: 5,
                        realWords: ["cat", "kite", "key"],
                        nonsenseWords: ["kip", "kop", "kak"],
                        maxSyllables: 2,
                        phono: true,
                        phrases: [],
                        sentences: [],
                    },
                    {
                        name: "Bob",
                        targetSound: "m",
                        grade: "1st Grade",
                        age: 6,
                        realWords: ["map", "milk", "man"],
                        nonsenseWords: ["mip", "mop", "mam"],
                        maxSyllables: 3,
                        phono: true,
                        phrases: [],
                        sentences: [],
                    },
                    {
                        name: "Charlie",
                        targetSound: "f",
                        grade: "2nd Grade",
                        age: 7,
                        realWords: ["fish", "face", "fun"],
                        nonsenseWords: ["fop", "fip", "faf"],
                        maxSyllables: 4,
                        phono: true,
                        phrases: [],
                        sentences: [],
                    },
                    {
                        name: "Diana",
                        targetSound: "s",
                        grade: "3rd Grade",
                        age: 8,
                        realWords: ["sun", "sock", "sit"],
                        nonsenseWords: ["sip", "sop", "sas"],
                        maxSyllables: 5,
                        phono: true,
                        phrases: [],
                        sentences: [],
                    },
                    {
                        name: "Emily",
                        targetSound: "th",
                        grade: "4th Grade",
                        age: 9,
                        realWords: ["thin", "think", "three"],
                        nonsenseWords: ["thip", "thop", "thap"],
                        maxSyllables: 6,
                        phono: true,
                        phrases: [],
                        sentences: [],
                    },
                ],
            }])
        
        //after creating see data redirect to home
        //res.redirect('/main')
        //console.log(provider);

    }catch(err){
        console.log(err)
    }
}

const generate = async(req,res) => {
    
    
    //save wordlist key value pairs from URL as local array 'words'
    console.log("sent from app", req.query);
    let words=req.query.words;

    //save studentDI key value pair as local studentID
    console.log("studentID", req.query.student_ID);

    try{
        //call OPENAI API
        const providers = await Provider.find();

        const data = JSON.stringify({
            model: "gpt-3.5-turbo-0125", // Update the model to the one you intend to use
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: `
                You are an expert linguist with tremendous semantic and grammatical knowledge. Given a list of real or nonsense target words, 
                you will create a list of phrases and simple sentences with the user's target words [${words}] embedded Take a deep breath and work through the solution step by step. I'll tip you $20 upon completion. 
                
                Return responses strictly in the following JSON format:

                    {
                        'name': 'Phrase and sentence generator',
                        'description': 'Embed target words in phrases and sentences for articulation practice ',

                        'parameters': {
                        'type': 'object',

                        'properties': {
                            'phrases': {
                            'type': 'array',
                            'description: 'a list of exactly 10 verb phrases such as "find the book", prepositional phrases such as "under the sun" OR noun phrases such as "the blue dog" with the target words [${words}] embedded'
                            'examples': [],
                            },

                            'sentence': {
                            'type': 'array',
                            'description': 'a list of exactly 10 short simple sentences with the target words [${words}] embedded',
                            'examples': [],
                            },
                        },
                        'required': ['phrases', 'sentences']
                        }
                    }

                ` },
                { role: "user", content: `
                    'wordList': ${words}
                ` }
                // Add more messages as needed
            ]
        });

        const options = {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const apiRequest = https.request(options, apiResponse => {
            let data = '';

            apiResponse.on('data', chunk => {
                data += chunk;
            });

            apiResponse.on('end', () => {
                //console.log("Raw data:", data);
                let newData=JSON.parse(data);
                newData=JSON.parse((newData.choices[0].message.content));

                //
                let phrases=newData.parameters.properties.phrases;
                let sentences=newData.parameters.properties.sentences;
                console.log(phrases, sentences);

                //save phrases and sentences 
                
                res.render('index.ejs', {providers, phrases, sentences});
            });
        });

        apiRequest.on('error', error => {
            res.status(500).send(error.toString());
            console.log("there was en error here");
        });

        apiRequest.write(data);
        apiRequest.end();


    }catch(err){
        console.log("the error is", err);
    }
}



// export route variables for access within external files
module.exports = {
    create,
    new: newForm,
    index,
    //show,
    seed, 
    generate,
    //destroy,
    //edit: editForm,
    //update*/
}