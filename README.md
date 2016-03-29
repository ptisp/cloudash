# cloudash

Cloudash is an opensource cloud web panel/dashboard abstracting lower level IaaS infrastructures.

* DigitalOcean'ish feeling on top of a lower level IaaS. (supporting OpenNebula)
* Multi tenant with independent resources plans.
* Built-in optional ticketing system.
* Action logging system.
* VM ownership.
* Feature rich VM. (metrics, console, editable resources and network)

## Requirements

* MongoDB
* Nodejs
* OpenNebula

## Installation

* `git clone https://github.com/ptisp/cloudash`
* `cd cloudash`
* `mv config.js.example config.js`
* `vi config.js`
* `node install.js`
* `node main.js`

## SSL (optional)

Easiest and cleanest way to use SSL is using `nginx` as a reverse proxy in front of cloudash.

Example `nginx` conf file.
```
server {
  listen   443 ssl;
  server_name ~^(.+)$;

  location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
    proxy_pass http://127.0.0.1:8080/;

    ssl_certificate     /var/cert/ssl.crt;
    ssl_certificate_key /var/cert/ssl.key;
  }
}
```

## License

[PTisp](https://ptisp.pt)

Licensed under the Apache license, version 2.0 (the "license"); You may not use this file except in compliance with the license. You may obtain a copy of the license at:

    http://www.apache.org/licenses/LICENSE-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the license is distributed on an "as is" basis, without warranties or conditions of any kind, either express or implied. See the license for the specific language governing permissions and limitations under the license.
