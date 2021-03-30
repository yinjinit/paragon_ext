{{log this}}
<section class="product-list-lists">

    <header class="product-list-lists-header">
        <h2 class="product-list-lists-title">{{reportName}}</h2>
<br>
        <h2 style="text-align: right" > <button style="background-color:#FFFFFF" id="downloadLink" href="#" >Export To Excel</button></h2>
        <!--<span class="align-right"> <a class="btn btn-primary"  action="exportCSV">Export</a></span> --> 
    </header>	

    <div class="product-list-table-container">
        <table class="table table-striped" id="custom-reports-table">
            {{#each columnList}}
            <th class="quote-list-content-table-header-row-request">
                {{.}}
            </th>
            {{/each}}
            <tr>
                {{#each valuesList}}
                {{#each values}}
                <td> {{this}} </td>
                </td>
                {{/each}}
            </tr>
            {{/each}}
        </table>
    </div>
</section>