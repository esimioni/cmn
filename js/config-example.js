// IP of the CoolMasterNet
CMNET_IP = '192.168.110.10';

// Serial Number (MAC Address) of the CoolMasterNet
CMNET_SN = '283B96012D5F';

BASE_URL_V1 = 'http://' + CMNET_IP + '/v1.0/device/' + CMNET_SN + '/raw?command='
BASE_URL_V2 = 'http://' + CMNET_IP + '/v2.0/device/' + CMNET_SN

// You'll likely need to "Shift + Reload" the page after changing the parameters below
MODES_HIDDEN = ['Dry', 'Auto']

// The L1.ALL is a "virtual" entry that enables you to control all units at once.
// If it you don't need it, you can remove it from the variable below.
UNIT_NAMES = {
    'L1.101': 'Living 1',
    'L1.102': 'Living 2',
    'L1.201': 'Meditation',
    'L1.202': 'Bedroom',
    'L1.203': 'Office',
    'L1.ALL': 'All'
};

UNIT_KEY_TEMPS = {
    'L1.101': { data: [20, 21, 22, 22.5, 23, 23.5, 24, 24.5] },
    'L1.102': { data: [20, 21, 22, 22.5, 23, 23.5, 24, 24.5] },
    'L1.201': { data: [20, 21, 22, 22.5, 23, 23.5, 24, 24.5] },
    'L1.202': { data: [20, 21, 22, 22.5, 23, 23.5, 24, 24.5] },
    'L1.203': { data: [20, 21, 22, 22.5, 23, 23.5, 24, 24.5] },
    'L1.ALL': { data: [20, 21, 22, 22.5, 23, 23.5, 24, 24.5] }
}

TEMP_MIN = 16
TEMP_MAX = 30
TEMP_STEP = 0.5