GridHelper
==========

Small Javascript library for creating dynamic tables with javascript.
We need the leatest [Prototype](http://prototypejs.org/) library.

Example:
```html
<div id="tableContainer"></div>
```

```javascript
var data = [
		{id:'a',name:'alan',valor:'987'},
		{id:'b',name:'bean',valor:'98798'},
		{id:'c',name:'coco',valor:'6545456'}
	];
/**
 * Param 1 Propiedades de header y row de titulo
 * Param 2 definicion de contenido de TD
 */
var titles = new Titles({
				headerProperties : {id : 'idHeader'},
				rowProperties :	{id : 'rowHeader'}
			},	/**El orden importa*/
			[	new GenericElement({value:'ID'},{align:'center'}),
				new GenericElement({value:'VALOR'},{align:'center'}),
				new GenericElement({value:'NOMBRE'})
		      	]);
/*
 * Configuracion de titulos y contenido
 * @param properties : Objeto que contiene la configuracion, posibles opciones:
 * - titles (requerido, de tipo Titles) Defincion del header.
 *  - table (opcional) Atributos que tendra la tabla generada por el GridHelper
 *  - body (requerido) Definicion de las columnas y como se manejaran sus respectivos valores.
 *  - tbody (opcional) Atributos que tendra el tbody generado por el GridHelper
 *  - noDataLabel (opcional) (label:String,properties:{htmlAttributes}) 
 *    Atributo para mostrar un label de no hay informacion cuando se tiene el data vacio.
 * */
var grid = new GridHelper({
		table	:	{	
					id		:	'idTabla',
					border	:	'1',
					'class'	:	'pure-table pure-table-bordered',
					'width'	:	'100%',
					align	:	'center'
				},
		titles	: titles,
		body	: [	/**El orden importa*/
				new GenericElement({'value-property':'id'},	{align:'center'}),
				new Input({type:'text',id:'valor','value-property':'valor'}),
				new Input({type:'text',id:'nombre','value-property':'name'})
				],
		tbody	:	{id:'id-tbody-example'},
		noDataLabel	:	{
	    		label		:	'No existe informacion.',
	    		properties	:	{align:'center'}
	    	}
	});

grid.setDataContent(data);

grid.renderGrid('tableContainer');

```
Delete a specific row
```javascript
grid.deleteRow(index)
```

Add a new row, only pass a new object
```javascript
grid.addRow({id:90, ...});
```

Add formatters to add extra functionality to your output columns, only GenericElements (div's) by now.
```javascript
/**Must receive only 1 parameter that is the value to be format*/
GridTools.registerFormatter('currencyFormater', function(value){
	return '$'+format("#,##0.####", value);
});
```
In your body definition add a 'formatter-name' property with the formatter name
```javascript
body:[
	new GenericElement({'value-property':'id', 'formatter-name':'currencyFormater'})
]
```




