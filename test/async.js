// <<< Async >>>
const fetchUserAsync = async () => {
    // do network request in 10 secs ...
    console.log('loading...');
    return 'woojin';
}

const user = fetchUserAsync();
user.then(console.log);
console.log('1');
