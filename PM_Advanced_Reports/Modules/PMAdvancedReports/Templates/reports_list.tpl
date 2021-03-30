{{log this}}
<section class="product-list-lists">

    <header class="product-list-lists-header">
        <h2 class="product-list-lists-title">{{translate 'Advanced Reports'}}</h2>
        
    </header>	
<table class="table table-striped" id="custom-reports-table">
<tr>
{{#each collection }}
<td style="font-size: 16px;"> {{name}} </td>
<td>
<span class="align-right"> 
<a class="btn btn-primary" href='#pubreport/{{internalid}}/{{name}}'>Report</a>
</span>
</td>
</tr>
{{/each}}
</section>


