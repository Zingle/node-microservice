Zingle Node.js Microservice Project
===================================
This project template can be used to start a new Node.js microservice project.
It demonstrates the standard for interoperating with the Zingle infrastructure.

Features
--------
 * supports systemd socket activation
 * supports using project as imported module via `index.js` exports
 * supports using "npm start" via `service.js`
 * installs `daemon` command for CLI (configure in package.json "bin" key)
 * recognizes the following environment variables
   * **LISTEN_PORT**: TCP port for service listener
   * **TLS_CERT**: path to PEM cert or PKCS single-file cert
   * **TLS_CA**: path to intermediary PEM cert
   * **TLS_KEY**: path to PEM private key
 * recognizes the following arguments
   * **--tls-cert**: overrides **TLS_CERT** environment variable
   * **--tls-ca**: overrides **TLS_CA** environment variable
   * **--tls-key**: overrides **TLS_KEY** environment variable
 * can be configured to auto-restart service when new version is installed

New Project Checklist
---------------------
 * wipe your `.git` folder so you don't have this project's history
 * update `package.json` file with your project settings
 * change `bin/daemon.js` to more appropriate name and update package "bin"
 * for private projects, change LICENSE file to: "© 2019 Zingle, Inc.  All
   rights reserved."
 * delete/rewrite this README for your project

Systemd Service Units
---------------------
The following can be added as systemd unit files to setup a microservice on a
new server.  These files setup a microservice service unit, a socket unit for
socket activation, a path unit to watch for upgrades, and a corresponding
service unit to stop the service when an upgrade occurs.  After an upgrade is
triggered and the service is stopped, socket activation will handle restarting
the primary service.

For a typical setup, only the socket and path units should be enabled.

#### Upgrade Watch Path Unit

```
# /etc/systemd/system/my-service-watch.path
[Path]
PathChanged=/usr/local/lib/node_modules/my-service/package.json

[Install]
WantedBy=multi-user.target
```

#### Upgrade Watch Service Unit

```
# /etc/systemd/system/my-service-watch.service
[Unit]
Description=upgrade trigger for my-service

[Service]
Type=oneshot
ExecStart=/bin/sleep 1
ExecStart=/bin/systemctl stop my-service.service
```

#### Activation Socket Unit

```
# /etc/systemd/system/my-service.socket
[Socket]
ListenStream=443

[Install]
WantedBy=sockets.target
```

#### Micro Service Unit

```
# /etc/systemd/system/my-service.service
[Unit]
Description=my-service server

[Service]
ExecStart=/usr/local/bin/my-service
UMask=02
StandardOutput=syslog
StandardError=syslog
Group=zingle

[Install]
WantedBy=multi-user.target
```
