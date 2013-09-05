GridHelper
==========

Small Javascript library for creating dynamic tables with javascript.
We need the leatest [Prototype](http://prototypejs.org/) library.

Example:
Add a container like this
```html
<div id="tableContainer"></div>
```
Javascript code for the initialization and generation of the grid.
```javascript
var data = [
		{id:'a',name:'gonzo', valor:'12645'},
		{id:'b',name:'jean',  valor:'1247'},
		{id:'c',name:'chisto',valor:'6589'}
	];
/**
 * Param 1 HTML attributes for the thead and tr generated fot the header.
 * Param 2 Definition of the titles itselfs.
 */
var titles = new Titles(null ,	
			/**Order matters*/
			[	new GenericElement({value:'ID'},{align:'center'}),
				new GenericElement({value:'VALOR'},{align:'center'}),
				new GenericElement({value:'NOMBRE'})
		      	]);
/*
 * Content configuration:
 * @param properties : Main object that will store all the configuration, available options:
 * - titles (required, type Titles) Define the header of the table.
 *  - table (optional) HTML attributes that the table generated will have.
 *  - body (required) Column definition and how the values will be handle.
 *  - tbody (optional) HTML attributes that the TBODY element will have.
 *  - noDataLabel (optional) (label : String, properties : {htmlAttributes}) 
 *     If the table have no data, it will display this label.
 * */
var grid = new GridHelper({
		table	:	{	
					id	:	'idTable',
					border	:	'1',
					'class'	:	'awesome-class-for-table',
					'width'	:	'100%',
					align	:	'center'
				},
		titles	: titles,
		body	: [	/**Order matters*/
				new GenericElement({'value-property':'id'}, {align:'center'}),
				new Input({type:'text', id:'valor',  'value-property':'valor'}),
				new Input({type:'text', id:'nombre', 'value-property':'name'})
			    ],
		noDataLabel	:	{
	    		label		:	'No Data available.',
	    		properties	:	{align:'center'}
	    	}
	});

/**Set the array of data that will generate the body of your table*/
grid.setDataContent(data);
/**Render the table, here is where the table is generated*/
grid.renderGrid('tableContainer');

```
Delete a specific row
```javascript
grid.deleteRow(index)
```

Add a new row, only pass a new object
```javascript
grid.addRow({id:'d',name:'john',valor:'6695'});
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




