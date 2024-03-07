
const Provider = require("../models/Provider").Provider
const Student = require("../models/Provider").Student
const bcrypt = require('bcrypt')
const router = require('express').Router()
const https = require("https");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

//NEW | GET
// render a new form
const newForm = (req,res) => {

};

//CREATE | POST
// manipulate data
const create = async(req, res) => {

    let provider_id = req.query.provider_id;
    console.log(provider_id);
    let targetSound = encodeURIComponent(req.body.targetSound);
    let maxSyllables = req.body.maxSyllables;
    let wordPosition = req.body.wordPosition;
    let phono = req.body.phono;
    let excludedSound = encodeURIComponent(req.body.excludedSound);
    
    try{
        //call OPENAI API
        //const providers = await Provider.find();

        const data = JSON.stringify({
            model: "gpt-3.5-turbo-0125", // Update the model to the one you intend to use
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: `
                You are an expert linguist with tremendous semantic and grammatical knowledge. Given a list of strict parameters, 
                you will create a list of 6 words for articulation practice. Take a deep breath and work through the solution step by step. I'll tip you $20 upon completion. 
                
                The target sound should be the phoneme "${targetSound}". Please ensure that the target sound appears in the specified word position (${wordPosition}) and that it matches the exact phonetic representation of the phoneme.
                Correct result: 
                "r" in word-intial position --> rat, rookie, roam 
                "r" in word-medial position --> borrow, hairy, porous
                "r" in word-final position --> bear, fire, soar

                Incorrect result:
                "r" in word-intial position --> oar, arrow, perfect
                "r" in word-medial position --> perfect, tire, dinosaur
                "r" in word-final position --> rile, cry, bury

                For the phoneme "g", correct examples include "go" and "big", where "g" is a stop consonant. Incorrect examples include "magenta" and "region", where the letter "g" represents an affricate.

                ${
                    phono === "single_sound_disorder"
                    ? "For a child with a single-sound disorder, it is recommended to select target words with low phonological density. This minimizes the risk of confusion and helps the child focus on the specific sound in isolation."
                    : "For a child with a phonological disorder, a mix of target words with high and low phonological density can be beneficial. These words provide more opportunities for the child to practice the sound in different phonological contexts, promoting generalization and flexibility in speech production."
                }

                The target phoneme or phonemes "${targetSound}" should be in the "${wordPosition}" position of the nonsense words. For example, if the target phoneme is "s" and the word position is "initial," the nonsense words should start with the "s" sound, like "sab" or "sef."

                It's important that the generated nonsense words adhere to the phonotactic constraints of the target language, ensuring they are pronounceable and follow typical sound patterns.

                Please review the generated nonsense words to confirm that they meet the specified criteria, especially regarding the word position of the target sound.


                Return responses strictly in the following JSON format :

                    {
                        "realWords": {
                            "type": "array",
                            "description": "a list of 4 real words with ${targetSound} in ${wordPosition} position containing ${maxSyllables} syllables excluding the sound ${excludedSound}",
                            "examples": [],
                            },

                            "nonsenseWords": {
                            "type": "array",
                            "description": "a list of 2 nonsense words with ${targetSound} in ${wordPosition} position containing ${maxSyllables} syllables excluding the sound ${excludedSound}",
                            "examples": [],
                            },

                        "required": ["realWords", "nonsenseWords"]
                        
                    }

                ` },
                { role: "user", content: `
                    "targetSound": "${targetSound}",
                    "maxSyllables": ${maxSyllables},
                    "wordPosition": "${wordPosition}",
                    "disorder": "${phono}"
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

            apiResponse.on('end', async () => {
                //console.log("Raw data:", data);
                let newData = JSON.parse(data);
                newData = JSON.parse(newData.choices[0].message.content);
                
                realWords = newData.realWords.examples;
                nonsenseWords = newData.nonsenseWords.examples;

                try{
                    
                    const providers = await Provider.findById(provider_id);

                    const newStudent = await Student.create(req.body);
                    newStudent.realWords = realWords;
                    newStudent.nonsenseWords = nonsenseWords;

                    providers.students.push(newStudent);
        
                    await providers.save();


                    //save phrases and sentences 
                    //res.render('index.ejs', {providers, phrases, sentences});
                    res.redirect('/');

                }catch(err){
                    console.log(err);
                }

                
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


//INDEX | GET
// render the home page with indexed students
const index = async(req,res) => {
    try{
        //console.log("session_id", req.session);
        let provider;
        if (req.session.currentUser) {
            provider = await Provider.findById(req.session.currentUser._id);
        }
        
        //const providers = await Provider.find();
        //console.log("id is: ", req);
        //console.log("provider by id", providers);
        //const providers = await Provider.find();

        res.render('index.ejs', {
            providers: provider 
        });
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
                        firstName: 'John',
                        lastName: 'Doe',
                        targetSound: 's',
                        grade: '1st',
                        age: 7,
                        realWords: ['sun', 'sand', 'sock'],
                        nonsenseWords: ['sib', 'sul', 'sep'],
                        maxSyllables: 2,
                        phono: 'initial',
                        phrases: [],
                        sentences: [],
                        wordPosition: 'initial'
                    },
                    {
                        firstName: 'ally',
                        lastName: 'Doe',
                        targetSound: 's',
                        grade: '2st',
                        age: 14,
                        realWords: ['sun', 'sand', 'sock', 'sore'],
                        nonsenseWords: ['sul', 'sep'],
                        maxSyllables: 2,
                        phono: 'artic',
                        phrases: [],
                        sentences: [],
                        wordPosition: 'initial'
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
    let studentID = req.query.student_ID;
    let providerID = req.query.provider_ID;

    try{ 
        const provider = await Provider.findById(providerID);
        const student = await provider.students.id(studentID);
        console.log(student);
    } catch(err) {
        console.log(err);
    }
    
    try{
        //call OPENAI API
        const providers = await Provider.find();

        const data = JSON.stringify({
            model: "gpt-3.5-turbo-0125", // Update the model to the one you intend to use
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: `
                You are an expert linguist with tremendous semantic and grammatical knowledge. Given a list of real or nonsense words, 
                you will create a list of phrases and simple sentences with the user's target words [${words}] embedded. 
                
                Return responses strictly in the following JSON format:

                    {
                        'name': 'Phrase and sentence generator',
                        'description': 'Embed target words in phrases and sentences for articulation practice ',

                        'parameters': {
                        'type': 'object',

                        'properties': {
                            'phrases': {
                            'type': 'array',
                            'description: 'a list of exactly 6 prepositional phrases such as "in the book" OR noun phrases such as "the blue dog" with the following words embedded: ${words}'
                            'examples': [],
                            },

                            'sentence': {
                            'type': 'array',
                            'description': 'a list of exactly 6 short simple sentences with the following words embedded: ${words}',
                            'examples': [],
                            },
                        },
                        'required': ['phrases', 'sentences']
                        }
                    }

                Take a deep breath and work through the solution step by step. I'll tip you $20 upon completion. 

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

            apiResponse.on('end', async () => {
                
                let newData = JSON.parse(data);
                newData = JSON.parse(newData.choices[0].message.content);

                let phrases = newData.parameters.properties.phrases.examples;
                let sentences = newData.parameters.properties.sentences.examples;
                

                try{
                    //save phrases and sentences in target Student schema & updated sub and parent schemas
                    const provider = await Provider.findById(providerID);
                    const student = provider.students.id(studentID);

                    student.phrases=phrases;
                    student.sentences=sentences;
                    await provider.save();
                    
                    res.redirect('/');
                    return;

                }catch(err){
                    console.log(err);
                    return;
                }

                
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

const destroy = async(req,res) => {
    try{
        //receive providerID and studentID
        
        let providerID = req.body.provider_id;
        let studentID = req.body.student_id;

        const provider = await Provider.findById(providerID);
        const student = provider.students.id(studentID);
        
        await Provider.updateOne(
            { _id: providerID }, // Match the provider document
            { $pull: { students: { _id: studentID } } } // Remove the student from the students array
        );
        
        res.redirect('/');

    }catch(err){
        console.log(err);
    }
}

const update =  async (req, res)=>{
    try{
        //set value for id's providerID and studentID
        console.log("body: ", req.body);
        console.log("query: ", req.query);
        let providerID = req.query.provider_id;
        let studentID = req.body.student_id;

        //find provider and user by ID
        const provider = await Provider.findById(providerID);
        let foundStudent = provider.students.id(studentID);

        //update entire student
        //consulted ChatGPT (OpenAI) for function method Object.assign
        Object.assign(foundStudent, req.body);
        await provider.save();

        //update student with data from reqbody
        foundStudent = await Student.findByIdAndUpdate(studentID, req.body, {new:true});
        
        foundStudent.save();

        res.redirect('/');

    }catch(err){
        console.log(err)
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
    destroy,
    //edit: editForm,
    update
}