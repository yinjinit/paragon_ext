{{log this}}
<section class="pm-info-card">
  <div class="pm-info-card-header">
    <h1>{{customerName}}</h1>
  </div>
  <div class="pm-info-card-content">
    {{#each salesRep}}
    <div class="pm-salesrep-info-card">
      <div class="card-container row">
        <div class="card-details">
          <h4 class="card-details-name">{{firstName}} {{lastName}}</h4>
          <h4 class="card-details-extra">{{jobtitle}}</h4>
          <h5 class="card-details-extra"><strong>Email:</strong> {{email}}</h5>
          <h5 class="card-details-extra"><strong>Phone:</strong> {{phone}}</h5>
          <h5 class="card-details-extra"><strong>Mobile:</strong> {{mobilePhone}}</h5>
        </div>
        <div class="image-container">
          <img src="{{image}}" alt="">
        </div>
      </div>
    </div>
    {{/each}}
  </div>
</section>


<!--
  Available helpers:
  {{ getExtensionAssetsPath "img/image.jpg"}} - reference assets in your extension
  
  {{ getExtensionAssetsPathWithDefault context_var "img/image.jpg"}} - use context_var value i.e. configuration variable. If it does not exist, fallback to an asset from the extension assets folder
  
  {{ getThemeAssetsPath context_var "img/image.jpg"}} - reference assets in the active theme
  
  {{ getThemeAssetsPathWithDefault context_var "img/theme-image.jpg"}} - use context_var value i.e. configuration variable. If it does not exist, fallback to an asset from the theme assets folder
-->