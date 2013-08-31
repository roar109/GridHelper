GridHelper
==========

Javascript small library for creating dynamic tables with javascript.
We need the leatest [Prototype](http://prototypejs.org/) library.

Example:
```html
<div id="tableContainer"></div>
```

```javascript
var data = [{id:'a',name:'alan',valor:'987'},{id:'b',name:'bean',valor:'98798'},
		{id:'c',name:'coco',valor:'6545456'}];
/**
 * Param 1 Propiedades de header y row de titulo
 * Param 2 definicion de contenido de TD
 */
var titles = new Titles({
				headerProperties : {id : 'idHeader'},
				rowProperties :	{id : 'rowHeader'}
			},
			[	new GenericElement({value:'ID'},{align:'center'}),
				new GenericElement({value:'VALOR'},{align:'center'}),
				new GenericElement({value:'NOMBRE'})
		      	]);

/**
 * Configuracion de tabla y titulos
 * titles : Configuracion de titulos, objeto Titles
 * table  : Propiedades de la tabla, objeto generico con propiedades
 * body	  : Definicion de los datos que pintara
 */
var grid = new GridHelper({
		table	:	{	
					id		:	'idTabla',
					border	:	'1',
					'class'	:	'pure-table pure-table-bordered',
					'width'	:	'100%',
					align	:	'center'
				},
		titles	: titles,
		body	: [	/**The order matters*/
				new GenericElement({'value-property':'id'},	{align:'center'}),
				new Input({type:'text',id:'valor','value-property':'valor'}),
				new Input({type:'text',id:'nombre','value-property':'name'})
				],
		tbody	:	{id:'id-tbody-example'}
	});

grid.setDataContent(data);

grid.renderGrid('tableContainer');
```
