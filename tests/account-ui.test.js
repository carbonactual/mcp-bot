const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const source=fs.readFileSync('auth/index.html','utf8');const home=fs.readFileSync('account/index.html','utf8');
test('CIBN account UI collects required fields',()=>{for(const s of ['full_name','phone','email','password'])assert.match(source,new RegExp(s));});
test('CIBN account UI has recovery and reset support',()=>{assert.match(source,/auth-recover/);assert.match(source,/auth-reset/);assert.match(source,/recovery\(\)/);});
test('CIBN authenticated home is intentionally focused',()=>{assert.match(home,/Stage/);assert.match(home,/Status/);assert.match(home,/Next/);});
