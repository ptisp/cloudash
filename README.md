# cloudash

Cloudash is an opensource cloud panel abstracting lower level IaaS clouds/infrastructures.

* Abstracts infrastructure from multiple IaaS clouds. (currently supporting OpenNebula)
* Multi tenant with independent resources for each users.
* Builtin optional ticketing system.
* Action logging system.
* VM ownership.
* Feature rich VM. (metrics, console, editable resources and network)

## Requirements

* MongoDB
* Nodejs
* OpenNebula

## Installation

* `git clone https://github.com/ptisp/cloudash`
* `mv config.js.example config.js`
* `vi config.js`
* `npm install`
* `npm start`

## License

[PTisp](https://ptisp.pt)

Licensed under the Apache license, version 2.0 (the "license"); You may not use this file except in compliance with the license. You may obtain a copy of the license at:

    http://www.apache.org/licenses/LICENSE-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the license is distributed on an "as is" basis, without warranties or conditions of any kind, either express or implied. See the license for the specific language governing permissions and limitations under the license.