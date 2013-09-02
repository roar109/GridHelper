/**
 * Clase generica, se utilice este patron para crear mas componentes.
 * */
var GenericElement = Class.create({
	initialize: function(attributes, tdProperties){
	    this.attributes = attributes||{};
	    this.tdProperties = tdProperties || {};
	    this.tag = 'div';
	    this.type = null;
	    this.classType = 'ELEMENT';
	},
	getType	:	function(){return this.type;},
	getTag	:	function(){return this.tag;},
	getFormatedValue	: function(value, formatterName){return GridTools.formaters[formatterName](value);}
});
var Input = Class.create(GenericElement, {
	initialize: function(attributes, tdProperties){
	    this.attributes = attributes||{};
	    this.tdProperties = tdProperties || {};
	    this.tag = 'input';
	    this.classType = 'ELEMENT';
	}
});
var Button = Class.create(GenericElement, {
	initialize: function(attributes, tdProperties){
	    this.attributes = attributes||{};
	    this.tdProperties = tdProperties || {};
	    this.tag = 'button';
	    this.type = null;
	    this.classType = 'ELEMENT';
	}	
});
var Image = Class.create(GenericElement, {
	initialize: function(attributes, tdProperties){
	    this.attributes = attributes||{};
	    this.tdProperties = tdProperties || {};
	    this.tag = 'img';
	    this.type = null;
	    this.classType = 'ELEMENT';
	}	
});

/**
 * Clase que Titles que crea un patron de como se formara el titulo de la tabla.
 * */
var Titles = Class.create({
	/**
	 * @param rowAndBodyProperties: Objeto con las propiedades rowProperties y headerProperties, son opcionales, 
	 * indican que propiedades se agregaran a los elementos creados.
	 * @param columnHeaderDefinitionList: Definicion de que tipos sera cada columna del header con sus respectivos valores.
	 * */
	initialize: function(rowAndBodyProperties, columnHeaderDefinitionList){
		this.rowAndBodyProperties = rowAndBodyProperties || {};
		this.rowProperties = this.rowAndBodyProperties.rowProperties || {};
		this.headerProperties = this.rowAndBodyProperties.headerProperties || {};
		this.columnHeaderDefinitionList  = columnHeaderDefinitionList;
		this.classType = 'TITLES';
	},
	/**
	 * @return HTML#THEAD#Element : Forma un elemento thead y lo regresa para su manejo.
	 * */
	getTitlesElement	:	function(){
		var thead_ = GridTools.createElementWithProperties('thead', this.headerProperties);
		var tr_ = GridTools.createElementWithProperties('tr', this.rowProperties);
		var td_ = null;
		Element.insert(thead_, tr_);
		this.columnHeaderDefinitionList.each(function(title){
			if(title.classType == 'ELEMENT'){
				td_ = GridTools.createElementWithProperties('td', title.tdProperties);
				Element.insert(td_, {
					bottom	:	GridTools.createElementWithProperties(title.getTag(), title.attributes)
				});
				Element.insert(tr_, td_);
			}
		});
		GridTools.logger('Titles component generated');
		return thead_;
	}
});
/**
 * Clase que genera tablas dinamicas dada su definicion.
 * */
var GridHelper = Class.create({
	/**
	 * Constructor
	 * @param properties : Objeto que contiene la configuracion, posibles opciones:
	 * 	- titles (requerido, de tipo Titles) Defincion del header.
	 *  - table (opcional) Atributos que tendra la tabla generada por el GridHelper
	 *  - body (requerido) Definicion de las columnas y como se manejaran sus respectivos valores.
	 *  - tbody (opcional) Atributos que tendra el tbody generado por el GridHelper
	 *  - noDataLabel (opcional) (label:String,properties:{htmlAttributes})Atributo para mostrar un label de no hay informacion cuando se tiene el data vacio.
	 * */
	initialize: function(properties){
	    this.properties = properties || {};
	    this.titles = this.properties.titles || {};
	    this.tableProperties = this.properties.table || {};
	    this.bodyDefinition = this.properties.body || [];
	    this.tbodyProperties = this.properties.tbody || {};
	    this.noDataLabel = this.properties.noDataLabel || null;
	    this.classType = 'HELPER';
	    if(this.titles.classType = 'TITLES'){
	    	this.titleGeneratedContent = this.properties.titles.getTitlesElement();
	    }
	    this.bodyGeneratedContent = null;
	    this.bodyDataContent = null;
	},
	/**
	 * @param arrayElements Lista de elementos para llenar la tabla que se generara.
	 * */
	setDataContent	:	function(arrayElements){
		this.bodyDataContent = arrayElements;
	},
	/**
	 * Funcion interna que genera el el cuerpo de la tabla.
	 * */
	renderBody	:	function(){
		if(!this.bodyDataContent)return;
		var n = 0;
		var tbody_ = GridTools.createElementWithProperties('tbody',this.tbodyProperties);
		var tr_ = null, td_ = null, element_ = null, this_ = this;/**use it when is inside foreach*/
		if(this.bodyDataContent.length == 0){
			if(this.noDataLabel){
				var noData = this.generateNoDataRow();
				Element.insert(tbody_, noData);
			}
		}else{
			this.bodyDataContent.each(function(rowData){
				tr_ = GridTools.createElementWithProperties('tr', {'row-index':n});
				this_.bodyDefinition.each(function(fieldDefinition){
					if(fieldDefinition.classType == 'ELEMENT'){
						td_ = GridTools.createElementWithProperties('td', fieldDefinition.tdProperties);
						element_ = GridTools.createElementWithProperties(fieldDefinition.getTag(), fieldDefinition.attributes, rowData, fieldDefinition);
						element_.id = GridTools.createId(element_.id, n);
						Element.insert(td_, {
							bottom	:	element_
						});
						Element.insert(tr_, td_);
					}
				});
				n++;
				Element.insert(tbody_, tr_);
			});			
		}

		this.bodyGeneratedContent = tbody_;
	},
	/**
	 * @param idContainer Contenedor donde se generara la tabla, sustituira el contenido, se sugiere que sea un "div".
	 * */
	renderGrid	: function(idContainer){
		this.idContainer = idContainer;
		var table_ = GridTools.createElementWithProperties('table', this.tableProperties);
		var body_ = null;
		/**Obtiene titulos generados*/
		if(this.titleGeneratedContent){
			Element.insert(table_, this.titleGeneratedContent);
		}
		/**Genera body*/
		this.renderBody();
		if(this.bodyGeneratedContent){
			Element.insert(table_, {bottom:this.bodyGeneratedContent});
		}
		/**Generar grid final*/
		if($(idContainer)){
			$(idContainer).innerHTML = '';
			$(idContainer).update(table_);
			 GridTools.logger('Table generated');
		}
	},
	/**
	 * @param rowObject Objeto a agregar a la tabla, sel mismo tipo que el contentBody
	 * */
	addRow	:function(rowObject){
		if(!this.bodyDataContent)return;
		if(!rowObject)return;
		var tr_ = GridTools.createElementWithProperties('tr', {});
		var n = this.bodyDataContent.length;
		this.bodyDefinition.each(function(fieldDefinition){
			if(fieldDefinition.classType == 'ELEMENT'){
				var td_ = GridTools.createElementWithProperties('td', fieldDefinition.tdProperties);
				var element_ = GridTools.createElementWithProperties(fieldDefinition.getTag(), fieldDefinition.attributes, rowObject);
				element_.id = GridTools.createId(element_.id, n);
				Element.insert(td_, {
					bottom	:	element_
				});
				Element.insert(tr_, td_);
			}
		});
		Element.insert(this.bodyGeneratedContent, tr_);
		this.bodyDataContent.push(rowObject);
	},
	/**
	 * @return HTML#Element con el label indicado.
	 * */
	generateNoDataRow	: function(){
		if(!this.noDataLabel.label){
			this.noDataLabel.label = "No%20existe%20informaci%F3n%20disponible.";
		}
		if(!this.noDataLabel.properties){
			this.noDataLabel.properties = {align:'center'};
		}
		var numberColumns = this.titles.columnHeaderDefinitionList.length;
		var tr_ = GridTools.createElementWithProperties('tr',{});
		var td_ = GridTools.createElementWithProperties('td',{colspan:numberColumns,'align':'center'});
		this.noDataLabel.properties.value = unescape(this.noDataLabel.label);
		var text = GridTools.createElementWithProperties('div', this.noDataLabel.properties);
		Element.insert(td_, text);
		Element.insert(tr_, td_);
		return tr_;
	},
	/**
	 * @param index Indice del renglon a borrar, corresponde a su respectivo objeto en el arreglo de informacion.
	 * */
	deleteRow	:	function(index){
		GridTools.logger('Deleting row with "row-index" value '+index);
		var rows = $(this.bodyGeneratedContent).select('[row-index="'+index+'"]');
		var this_ = this;
		rows.each(function(elm){
			$(elm).remove();
			this_.bodyDataContent[index] = null;
			GridTools.logger('Row with index '+index+' deleted.');
		});
		this.bodyDataContent = this.bodyDataContent.compact();
		this.renderGrid(this.idContainer);
	}
});
/**
 * Componente de utilidades varias.
 * */
var GridTools = {
	loggerActivated	:	true,
	formaters	:	{},
	/**
	 * Metodo de utilidades para logeo de javascript.
	 * @param messageOrData
	 * */
	logger	: function(messageOrData){
		if(!this.loggerActivated)return;
		if(window['console'] != null){
			window['console'].log(messageOrData);
		}
	},
	/**
	 * 
	 * @param elemementType (requerido) tipo de elemento que creara, por ej. 'input', 'button', etc.
	 * @param properties (requerido) objeto que contiene propiedades que contendra el elemento a crear.
	 * @param objectToGetValue (opcional) objeto de donde se obtendra el valor dictado por la propiedad 'value-property'.
	 * */
	createElementWithProperties	: function(elemementType, properties, objectToGetValue, propertyDefinition){
		var valuePropName = 'value', valuePropyName = 'value-property', formaterNameProperty = 'formatter-name';
		var el_ = new Element(elemementType, properties);
		if('div' == elemementType || 'button' == elemementType){
			/**Si tiene la propiedad de formater-name busca un formateador para el valor con ese nombre. 
			 * Se registra en GridTools.registerFormatter(name, function)*/
			var isFormaterPresent = (properties[formaterNameProperty])?true:false;
			var value = properties.value || this.getValueFromPropertiesAndData(properties, objectToGetValue);
			if(isFormaterPresent && propertyDefinition && Object.isFunction(propertyDefinition.getFormatedValue)){
				value = propertyDefinition.getFormatedValue(value, properties[formaterNameProperty]);
			}
			el_.removeAttribute(formaterNameProperty);
			el_.removeAttribute(valuePropName);
			el_.innerHTML = value;
		}else {
			if(objectToGetValue){
				/**From properties we get the value of the property 'value-property' and then get that property from objectToGetValue*/
				el_.value = properties.value || this.getValueFromPropertiesAndData(properties, objectToGetValue);
			}else{
				el_.value = properties.value || '';
			}
		}
		el_.removeAttribute(valuePropyName);
		return el_;
	},
	/**
	 * Metodo que obtiene el valor de el objeto objectToGetValue para asignar la propiedad valor al elemento de html creado.
	 * @param properties
	 * @param objectToGetValue
	 * */
	getValueFromPropertiesAndData : function(properties, objectToGetValue){
		var valuePropyName = 'value-property';
		if(properties[valuePropyName] && objectToGetValue[properties[valuePropyName]])
			return  objectToGetValue[properties[valuePropyName]];
		else
			return '';
	},
	/**
	 * Metodo que genera un id, concatenando el id actual y el index.
	 * @param currentId
	 * @param index
	 * */
	createId:function(currentId, index){
		if(!currentId)currentId = '';
		return currentId+'-'+index;
	},
	/**
	 * @param name Nombre del formateador que se usara como propiedad
	 * @param formater Funcion para evaluar
	 * */
	registerFormatter	: function(name, formater){
		this.formaters[name] = formater;
	}
};
