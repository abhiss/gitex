const degit = require('degit');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');



const requestHandler = async function (url) {
    console.log("STARTING REQUEST HANDLER");
    let directoryName = ('/gitex_temp/' + url.replace('/',''));

    try {
        const emitter = degit(url, {
            cache: false,
            force: true,
            verbose: true,
        });

        emitter.on('info', info => {
            console.log(info.message);
        });

        //clones repo
        await emitter.clone(directoryName).then(() => {
            console.log('done cloning repo');
        })

        console.log('analyzing source code');

        // exec(`tokei ${directoryName} -o json`, async function tokeiExecCallback(errorException, stdout, stderror) {
        //      //console.log('\x1b[36m%s\x1b[0m', stdout);
        //     await fs.promises.writeFile('/gitex_temp1', stdout);
        //     //console.log(stderror)
        //             //await new Promise(r => setTimeout(r, 2000));
        // console.log('done analyzing source code, chars:' + stdout.length);
        // return 'this is it';
        // })

        // -o json
        return (await promisify(exec)(`tokei ${directoryName} `, {maxBuffer: 1024 * 50000})).stdout;
        // return "we done";
    }
    catch (err) {
        console.log('error' + err);
        throw err;
    }
    finally {
        console.log('removing source directory', directoryName);

        await new Promise((res, rej) => fs.rmdir(directoryName + '/', { recursive: true }, (err)=>{
            console.error(err)
            if(err) rej("Deleting repo directory failed.", err);
            else res(true);
        }));

        console.log('done removing');
    }
}
module.exports = requestHandler;

//for testing

// (async () => {
//     var start = new Date()
//     console.log("start");
//     try {
//         let data = await requestHandler('altmp/altv-types');
//         fs.writeFileSync('/gitex_temp2', data);

//     }
//     catch (err) {
//         console.log("ERRORL:: "+ err);
//      }
//     //fs.rmdirSync('/code/torvaldslinux/', { recursive: true });

//     var end = new Date() - start
//     console.info('\n\nExecution time: %ds', end/1000);
// })()
