# CoolMasterNet-Web

![Web UI Preview](/ui_example.png)

This app runs locally, there's no need for Internet connection. The communication is just between the browser and the CoolMasterNet.
You can use a web server like Nginx, Apache, etc., or even open the `index.html` directly in a browser if that option suits you.

## Tested Hardware
```
Model:              CoolMasterNet
Firmware version:   1.4.0
HVAC System:        Daikin Multisplit
```

## Attention
Firmware 1.4.0+ is required, it won't work with earlier releases since they don't include CORS headers in the responses.
* If you don't want to upgrade the firmware, you can use [CORS-Anywhere](https://github.com/Rob--W/cors-anywhere) proxy to add the needed response headers.

## Setup
1) **Enable the REST API** and optionally define a port. There are two options for that:

* With Firmware 1.4.0 you can enable REST via the CoolMasterNet UI, but you can't change the port, the default is 10103.

* You can connect via Netcat to your CoolMasterNet using its IP address and port 10102.
  Example: `nc 192.168.100.170 10102`
  Then run the following commands:

  `rest enable`
  `rest port 80`

  You can, of course, choose a different port or leave it at the default.
  After running the commands, reboot (porwer cycle) the CoolMasterNet.

2) **Copy** `js/config-example.js` to `js/config.js` and edit its content.

3) **That is it!** When acessing the `index.html`, or the address defined by your webserver, it should list your indoor units and you should be able to control them.

## API System - For reference
The REST API documentation is available here: https://coolautomation.com/wp-content/uploads/sites/2/2019/09/CoolMasterNet-REST-API-spec.pdf

Relevant commands and general output are documented here: https://coolautomation.com/Lib/doc/prm/CoolAutomation-PRM-CoolMasterNet-v0.7.pdf

## Credits
This project was based on Peter Day's 'CoolMasterNet-Control': https://github.com/peterdey/coolmasternet