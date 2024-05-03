Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

function isDefined(variable) {
    return typeof variable !== 'undefined' && variable;
}

function isBlank(variable) {
    return !isDefined(variable) || variable == '';
}

function showError(json) {
    const msg = '<b>Error:</b> ajax request failed (<b>' + json.rc + '</b>) - command: \'<b>' + json.command + '\'</b>';
    var alert = document.getElementById('alert');
    alert.innerHTML = msg + ' <button type="button" class="btn-close float-end" onclick="hideError();" style="align:right;"></button>';
    alert.style.display = 'block';
}

function hideError() {
    var alert = document.getElementById('alert');
    alert.style.display = 'none';
    alert.innerHTML = '';
}

function jsonSuccessHandler(json, config, status, xhr) {
    if (status == 'success' && json.rc == 'OK') {
        if (config.success) {
            config.success(json);
        }
    } else {
        showError(json);
    }
}

function ajaxExecute(config) {
    $.ajax({
        type: config.method,
        url: config.url,
        data: (config.params ? config.params + '&' : ''),
        dataType: (config.dataType ? config.dataType : 'json'),
        async: !config.sync,
        success: function (blob, status, xhr) {
            jsonSuccessHandler(blob, config, status, xhr);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            jsonErrorHandler(jqXHR, textStatus, errorThrown, config.url, config);
        }
    });
    return false;
}

function preRenderTemplate(config) {
    const name = config.name ? '-' + config.name : '';
    const template = $('#template' + name).html();
    const parser = Handlebars.compile(template);
    return parser(config.json.data);
}

function renderTemplate(config) {
    const name = config.name ? '-' + config.name : '';
    const rendered = preRenderTemplate(config);
    $('#content' + name).html(rendered);
}

function loadList(conf) {
    ajaxExecute({
        url: conf.url,
        method: 'GET',
        success: function (json) {
            if (conf.preRender) {
                conf.preRender(json);
            }
            renderTemplate({
                json: json,
                name: conf.template
            });
            if (conf.success) {
                conf.success(json);
            }
        }
    });
    return false;
}

Handlebars.registerHelper('ifEqual', function (v1, v2, options) {
    return v1 === v2 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('ifNotEqual', function (v1, v2, options) {
    return v1 === v2 ? options.inverse(this) : options.fn(this);
});

/* Project specific code below this line */
Handlebars.registerHelper('unitName', function (id) {
    return UNIT_NAMES[id];
});

Handlebars.registerHelper('hideMode', function (mode) {
    return MODES_HIDDEN.contains(mode) ? 'hidden="true"' : '';
});

Handlebars.registerHelper('unitBg', function (mode, onOff, flr) {
    if (flr == 'OK') {
        return (isOn(onOff) ? mode.toLowerCase() : 'off') + '_background';
    } else {
        return 'error_background';
    }
});

Handlebars.registerHelper('modeSelect', function (mode, modeBtn) {
    return mode == modeBtn ? 'btn-info' : '';
});

Handlebars.registerHelper('powerSelect', function (onOff) {
    return isOn(onOff) ? 'btn-info' : '';
});

Handlebars.registerHelper('fanSelect', function (btn, fanMode, outTrue, outFalse) {
    return isFanOn(btn, fanMode) ? outTrue : outFalse;
});

function toCoolMasterParam(unitId) {
    return unitId == 'L1.ALL' ? '' : '&' + unitId.replace('.', '_');
}

function isOn(onOff) {
    return onOff === 'ON';
}

function isFanOn(btn, fanMode) {
    const isEqual = fanMode == btn;
    switch (btn) {
        case 'Auto':
        case 'High':
            return isEqual;
        case 'Low':
            return isEqual || fanMode == 'Med' || fanMode == 'High';
        case 'Med':
            return isEqual || fanMode == 'High';
    }
}

function refreshStates() {
    loadList({
        url: BASE_URL_V2 + '/ls2',
        preRender: function(json) {
            if (isDefined(UNIT_NAMES['L1.ALL'])) {
                json.data.push({
                    "uid"    : "L1.ALL",
                    "onoff"  : "OFF",
                    "st"     : "SET",
                    "rt"     : "NA",
                    "fspeed" : "NA",
                    "mode"   : "NA",
                    "flr"    : "OK",
                    "filt"   : "-",
                    "dmnd"   : "0"
                });
            }
        }
    });
}

function sendUnitCommand(unitId, command, value) {
    ajaxExecute({
        url: BASE_URL_V1 + command + toCoolMasterParam(unitId) + (isBlank(value) ? '' : '&' + value),
        method: 'GET',
        success: function (json) {
            if (command == 'cool' || command == 'heat' || command == 'fan') {
                setTempForMode(unitId, command);
            } else {
                refreshStates();
            }
        }
    });
}

function power_onclick(unitId, onOff) {
    var command;
    if (unitId == 'L1.ALL') {
        command = isOn(onOff) ? 'on' : 'off';
    } else {
        command = isOn(onOff) ? 'off' : 'on';
    }
    sendUnitCommand(unitId, command);
}

function mode_onclick(unitId, mode) {
    sendUnitCommand(unitId, mode.toLowerCase());
}

function setTempForMode(unitId, mode) {
    if (mode == 'cool' || mode == 'fan') {
        setTemperature(unitId, 16);
    } else {
        setTemperature(unitId, 30);
    }
}

function fan_onclick(unitId, speed) {
    sendUnitCommand(unitId, 'fspeed', speed);
}

function setTemperature(unitId, temperature) {
    sendUnitCommand(unitId, 'temp', temperature);
}

function setTemperatureFromModal(temperature) {
    const unitId = $('#unit-field').val();
    setTemperature(unitId, temperature);
}

function setTemperatureFromModalMin() {
    setTemperatureFromModal(TEMP_MIN);
}

function setTemperatureFromModalMax() {
    setTemperatureFromModal(TEMP_MAX);
}

function setTemperatureFromModalSlider() {
    setTemperatureFromModal($('#temp-field').val());
}

function modalUpdateTempMin() {
    modalUpdateTemp(TEMP_MIN)
}

function modalUpdateTempMax() {
    modalUpdateTemp(TEMP_MAX)
}

function modalUpdateTemp(value) {
    if (isDefined(value)) {
        $('#modal-temp').html(value);
    } else {
        var curr = $('#temp-field').val();
        $('#modal-temp').html(curr);
    }
}

/* Events */
$('#temperature-modal').on('show.bs.modal', function (e) {
    const tempField = $('#temp-field');
    tempField.attr('min', TEMP_MIN);
    tempField.attr('max', TEMP_MAX);
    tempField.attr('step', TEMP_STEP);

    const tempModal = e.currentTarget;
    tempModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;
        const unitId = button.getAttribute('data-bs-unit');
        const unitName = button.getAttribute('data-bs-name');
        const modalTitle = tempModal.querySelector('.modal-title');
        const modalTempInput = tempModal.querySelector('.modal-body input');
        var tempStr = button.getAttribute('data-bs-temp');
        tempStr = tempStr.substring(0, tempStr.length - 1);
        if (tempStr == 'SE') {
            tempStr = '22';
        }
        modalTitle.textContent = `${unitName} - Set Temperature`;
        modalTempInput.value = tempStr;
        $('#modal-temp').html(tempStr);
        $('#unit-field').val(unitId);

        renderTemplate({
            json: UNIT_KEY_TEMPS[unitId],
            name: 'modal'
        });
    });
});

document.addEventListener('visibilitychange', function (event) {
    if (!document.hidden) {
        refreshStates();
    }
});

// Initial load
$(function () {
    refreshStates();
});