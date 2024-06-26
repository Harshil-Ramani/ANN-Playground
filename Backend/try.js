// let fs=require('fs');
// const database = require('./database.js');

// const user=database.user;

// let find=user.findOne({userName:"harshil"});
// find.then((data)=>{
//     let ob={
//         weights:data.lastStatus.weights,
//         biases:data.lastStatus.biases
//     }
//     console.log(JSON.stringify(ob));
// });

// let defaults=fs.readFileSync('defaultDatasets.json','utf8');
// defaults=JSON.parse(defaults);

// let ar=dataset.findById(defaults.default);
// ar.then((data)=>{
//     console.log(data);
// });


// console.log(defaults);

// const ded=database.defaultDatasets;

// let f=dataset.find();

// f.then(function (data)
// {
//     let cnt=0;
//     let ar=[];
//     for(d of data)
//     {
//         ar[cnt++]=d._id;
//     }
//     console.log(ar);
//     let ad=new ded({
//         default: ar[0],
//         datasets: ar
//     });
//     ad.save().then(()=>{
//         console.log("done");
//     })
// });

// let weights=[];
// weights[0][2][1] = 5 ;
// console.log(weights);

// async function fun1()
// {
//     async function fun2()
//     {
//         return new Promise((resolve)=>{
//             setTimeout(() => {
//                 console.log("done inner!");
//                 resolve("inner resolved");
//             }, 5000);
//         })
//     }
//     fun2();
// }

// let x=fun1();

// x.then(()=>{
//     console.log("resolved!");
// });

// let ob={
//     A:5,
//     b:8
// };

// let {A,b} = ob;
// console.log(A);

// let ob={
//     a:5,
//     b:8
// }

// let obj={
//     P:5,
//     ... ob
// }
// console.log({...ob});

// let ob = {
//      a : 5 ,
//      b : 10
// }
// let {a,b:{c,d}}=ob;

// console.log(false && 0);


// function fun(){
//     let vr=5;
//     let f2=()=>{
//         console.log(vr);
//         vr+=5;
//     }
//     f2();
//     f2();
// }

// fun();

// let ar=[];

// ar[2]=5;
// ar[5]=1;
// console.log(ar[1],ar.length);

// let ar=[4,5,5,1,4];
// let ar2=ar.slice(1,3);
// console.log(ar);

// function fun(a,b) {
//     console.log(a);
//     if(b)console.log(b);
// }

// fun(4);

// let a=-2;
// let cnt=100;
// while((cnt--)!=0) {
//     a*=a;
//     console.log(a);
//     console.log(JSON.stringify(a));
// }

// console.log(Math.log(2.7));

// console.log((5 || 1));
// let points = [];
// let radius = 5;
// function getCircleLabel(p, center) {
//     return (dist(p, center) < (radius * 0.5)) ? 1 : -1;
// }

// numSamples=220;

// // Generate positive points inside the circle.
// for (let i = 0; i < numSamples / 2; i++) {
//     let r = randUniform(0, radius * 0.5);
//     let angle = randUniform(0, 2 * Math.PI);
//     let x = r * Math.sin(angle);
//     let y = r * Math.cos(angle);
//     let noiseX = randUniform(-radius, radius) * noise;
//     let noiseY = randUniform(-radius, radius) * noise;
//     let label = getCircleLabel({x: x + noiseX, y: y + noiseY}, {x: 0, y: 0});
//     points.push({x, y, label});
// }

// let ob={a:45};
// let ob2=JSON.stringify(ob);
// ob2=JSON.parse(ob2);
// console.log(typeof(ob2.a));

// let ob2={...ob};
// console.log(typeof(ob2.a));