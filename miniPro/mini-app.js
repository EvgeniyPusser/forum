// function a() {
//     console.log("A");
// }
//
// function b() {
//     console.log("B");
// }
//
// function c() {
//     console.log("C");
// }
//
// const handlers = [];
//
// handlers.push(a);
// handlers.push(b);
// handlers.push(c);
//
// for (let i = 0; i < handlers.length; i += 1) {
//     handlers[i]();
// }

// // console.log(handlers);
// //
// // handlers[0]();
// // handlers[1]();
// // handlers[2]();
//
// function a(data) {
//     data.count += 1;
//     console.log("A", data);
// }
//
// function b(data) {
//     data.count += 10;
//     console.log("B", data);
// }
//
// function c(data) {
//     data.count += 100;
//     console.log("C", data);
// }
//
// const handlers = [a, b, c];
// const data = { count: 0 };
//
// for (let i = 0; i < handlers.length; i += 1) {
//     handlers[i](data);
// }
//
// console.log("final", data);

// function setUser(data) {
//     data.user = { login: "admin" };
//     console.log("setUser", data);
// }
//
// function checkUser(data) {
//     console.log("checkUser", data.user);
// }
//
// const handlers = [setUser, checkUser];
// const data = {};
//
// for (let i = 0; i < handlers.length; i += 1) {
//     handlers[i](data);
// }

function log(data, next) {
    console.log("log");
    next();
}

function auth(data, next) {
    if (data.user !== "admin") {
        console.log("access denied");
        return;
    }

    console.log("access granted");
    next();
}

function hello(data, next) {
    console.log("hello");
}

const handlers = [log, auth, hello];
const data = { user: "guest" };

let index = 0;

function next() {
    const handler = handlers[index];
    index += 1;

    if (!handler) {
        return;
    }

    handler(data, next);
}

next();