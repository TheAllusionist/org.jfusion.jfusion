if (typeof JFusion === 'undefined') {
    var JFusion = {};
}

JFusion.changeSetting = function (fieldname, fieldvalue, jname) {
    //change the image
    new Request.JSON({
        url: JFusion.url,
        noCache: true,
        onRequest: function () {
            var element = $(jname + '_' + fieldname).getFirst().getFirst();
            element.set('src', 'components/com_jfusion/images/spinner.gif');
        },
        onSuccess: function (JSONobject) {
            JFusion.OnMessages(JSONobject.messages);

            JFusion.updateList(JSONobject.pluginlist);
        },
        onError: function (JSONobject) {
            JFusion.OnError(JSONobject);
        }
    }).get({'option': 'com_jfusion',
            'task': 'changesettings',
            'jname': jname,
            'field_name': fieldname,
            'field_value': fieldvalue});
};

JFusion.copyPlugin = function (jname) {
    JFusion.prompt(JFusion.JText('COPY_MESSAGE'), JFusion.JText('COPY'), function (value) {
        if (value) {
            // this code will send a data object via a GET request and alert the retrieved data.
            new Request.JSON({
                url: JFusion.url,
                noCache: true,
                onSuccess: function (JSONobject) {
                    JFusion.OnMessages(JSONobject.messages);

                    JFusion.updateList(JSONobject.pluginlist);
                },
                onError: function (JSONobject) {
                    JFusion.OnError(JSONobject);
                }
            }).get({'option': 'com_jfusion',
                    'task': 'plugincopy',
                    'jname': jname,
                    'new_jname': value});
            SqueezeBox.close();
        }
    });
};

JFusion.deletePlugin = function (jname) {

    JFusion.confirm(JFusion.JText('DELETE') + ' ' + JFusion.JText('PLUGIN') + ' ' + jname + '?', JFusion.JText('DELETE'), function () {
        // this code will send a data object via a GET request and alert the retrieved data.
        new Request.JSON({
            url: JFusion.url,
            noCache: true,
            onSuccess: function (JSONobject) {
                JFusion.OnMessages(JSONobject.messages);
                if (JSONobject.status ===  true) {
                    var el = $(JSONobject.jname);
                    el.parentNode.removeChild(el);
                }
            },
            onError: function (JSONobject) {
                JFusion.OnError(JSONobject);
            }
        }).get({'option': 'com_jfusion',
                'task': 'uninstallplugin',
                'jname': jname,
                'tmpl': 'component'});
    });
};

JFusion.submitForm = function (type) {
    new Request.JSON({
        noCache: true,
        format: 'json',
        onRequest: function () {
            $('spinner'+type).set('html','<img border="0" alt="loading" src="components/com_jfusion/images/spinner.gif">');
        },
        onSuccess: function(JSONobject) {
            $('spinner'+type).set('html','');
            JFusion.OnMessages(JSONobject.messages);

            JFusion.updateList(JSONobject.pluginlist);
        },
        onError: function (JSONobject) {
            JFusion.OnError(JSONobject);
        }
    }).post($('install'+type).toQueryString());
};

JFusion.downloadPlugin = function () {
    window.location = $('server_install_url').getSelected().get('value');
};

JFusion.updateList = function (html) {
    var list = $('sort_table');
    list.empty();
    list.set('html', html);
    this.initSortables();
};

JFusion.initSortables = function () {
    /* allow for updates of row order */
    new Sortables('sort_table', {
        /* set options */
        handle: 'div.dragHandles',

        /* initialization stuff here */
        initialize: function () {
            // do nothing yet
        },
        /* once an item is selected */
        onStart: function (el) {
            //a little fancy work to hide the clone which mootools 1.1 doesn't seem to give the option for
            var checkme = $$('div tr#' + el.id);
            if (checkme[1]) {
                checkme[1].setStyle('display', 'none');
            }
        },
        onComplete: function () {
            var sortorder, rowcount;
            //build a string of the order
            sortorder = '';
            rowcount = 0;
            $$('#sort_table tr').each(function (tr) {
                $(tr.id).setAttribute('class', 'row' + (rowcount % 2));
                rowcount++;
                sortorder = sortorder +  tr.id  + '|';
            });

            new Request.JSON({
                url: JFusion.url,
                noCache: true,
                onSuccess: function (JSONobject) {
                    JFusion.OnMessages(JSONobject.messages);

                    JFusion.updateList(JSONobject.pluginlist);
                },
                onError: function (JSONobject) {
                    JFusion.OnError(JSONobject);
                }
            }).get({'option': 'com_jfusion',
                    'task': 'saveorder',
                    'tmpl': 'component',
                    'sort_order': sortorder});
        }
    });
};