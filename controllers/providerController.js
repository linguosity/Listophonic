
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
        try{
            console.log(req.body);
            console.log(req.query);
            const providers = await Provider.findById(req.query.provider_id);

            const newStudent = await Student.create(req.body);
            providers.students.push(newStudent);

            await providers.save();

            res.redirect('/main');
        }catch(err){
            console.log(err)
        }
        
    
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
                //console.log("Raw data:", data);
                let newData = JSON.parse(data);
                newData = JSON.parse(newData.choices[0].message.content);

                //
                console.log(newData.parameters.properties.sentences);
                let phrases = newData.parameters.properties.phrases.examples;
                let sentences = newData.parameters.properties.sentences.examples;
                console.log("OpenAI api call:", phrases, sentences);

                try{
                    //save phrases and sentences in target Student schema & updated sub and parent schemas
                    const provider = await Provider.findById(providerID);
                    const student = provider.students.id(studentID);

                    console.log("found provider:  ", provider);
                    console.log("found student:  ", student);

                    student.phrases=phrases;
                    student.sentences=sentences;
                    await provider.save();
                    //const updatedStudent = await Student.findByIdAndUpdate(studentID, {phrases: phrases, sentences: sentences}, {new:true});
                    //console.log("updated student", updatedStudent);
                    //updatedStudent.save();

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

const destroy = async(req,res) => {
    try{
        //receive providerID and studentID
        console.log(req.body);
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
        const foundStudent = provider.students.id(studentID);

        //update student with data from reqbody
        foundStudent = await Student.findByIdAndUpdate(studentID, req.body, {new:true});
        
        await provider.save();

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