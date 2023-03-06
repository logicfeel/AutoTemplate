// <<< Promise >>>
const fetchUser = () => {
    return new Promise((resolve, reject) => {
        // do network request in 10 secs ...
        resolve('woojin');
    });
}

const user = fetchUser();
user.then(console.log);
console.log(1)