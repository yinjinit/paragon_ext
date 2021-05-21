define('EasyAsk.Model'
, [
    'SC.Model',
    'Categories.ServiceController',
    'LiveOrder.Model',
    'Models.Init'

  ]
, function
  (
    SCModel,
    CategoriesServiceController,
    LiveOrderModel,
    ModelsInit
  )
{
  'use strict';

  return SCModel.extend({
    name: 'EasyAsk'
/*
  , get: function ()
    {/*
      if(CategoriesServiceController.fullurl !== null) {
      try{
    
  var fullurlCategory = CategoriesServiceController.fullurl;
  nlapiLogExecution("audit","fullurlCategory outside",JSON.stringify(fullurlCategory));
  nlapiLogExecution("audit","LiveOrderModel",JSON.stringify(LiveOrderModel));

  fullurlCategory=fullurlCategory.replace("/products/","").toString();
  nlapiLogExecution("audit","fullurlCategory after replacement",JSON.stringify(fullurlCategory));
  const easyAskFormattedType = [
                    {item: 'notebooks', type: "Systems/Notebooks-Accessories/Notebooks"},
                    {item: 'notebooks/amd-notebooks', type: "Systems/Notebooks-Accessories/Notebooks/AMD-Notebooks"},
                    {item: 'notebooks/intel-notebooks', type: "Systems/Notebooks-Accessories/Notebooks/Intel-Notebooks"},
                    {item: 'notebooks/apple-notebooks', type: "Systems/Notebooks-Accessories/Notebooks/Apple-Notebooks"},
                    {item: 'notebooks/batteries', type: "Systems/Notebooks-Accessories/Notebook-Batteries"},
                    {item: 'notebooks/tablets', type: "Systems/Tablets-eBook-readers"},
                    {item: 'notebooks/notebook-accessories', type: "Systems/Notebooks-Accessories/Notebook-Tablet-Accessories"},
                    {item: 'notebooks/notebook-power-adapters', type: "Systems/Notebooks-Accessories/Notebook-Power-Adapters-Chargers"},
                      
                      {item: 'desktops', type: "Systems/Desktops-Workstations/Desktops"},
                      {item: 'desktops/worstations', type: "Systems/Desktops-Workstations/Desktops"},
                      {item: 'desktops/barebone-systems', type: "Systems/Desktops-Workstations/Barebone-Systems"},
                      {item: 'desktops/point-of-sale', type: "Systems/Desktops-Workstations/Point-Of-Sale-Computers"},
                      {item: 'desktops/thin-clients', type: "Systems/Desktops-Workstations/Thin-Clients"},
                      {item: 'desktops/kiosks', type: "Systems/Desktops-Workstations/Kiosks"},
                      {item: 'desktops/intel-desktops', type: "Systems/Desktops-Workstations/Desktops/Intel-Desktops"},

                    {item: 'servers', type: "Systems/Servers"},
                    {item: 'servers/tower-servers', type: "Systems/Servers/Tower-Servers"},
                    {item: 'servers/blade-servers', type: "Systems/Servers/Blade-Servers"},
                    {item: 'servers/server-clusters', type: "Systems/Servers/Clusters"},
                    {item: 'servers/rack-servers', type: "Systems/Servers/Rack-Servers"},

                    {item: 'printers', type: "Printers-Scanners/Printers"},
                      {item: 'printers/browse-printers', type: "Printers-Scanners/Printers"},
                      {item: 'printers/inkjet-printers', type: "Printers-Scanners/Printers/Ink-Jet-Printers"},
                      {item: 'printers/laser-printers', type: "Printers-Scanners/Printers/Color-Laser-Printers"},
                      {item: 'printers/pos-receipt-printers', type: "Printers-Scanners/Printers"},
                      {item: 'printers/thermal-printers', type: "Printers-Scanners/Printers/Thermal-Printers"},
                      {item: 'printers/dot-matrix-printers', type: "Printers-Scanners/Printers/Dot-Matrix-Printers"},
                      {item: 'printers/scanners', type: "Printers-Scanners/Printers/Scanners"},
                      
                      {item: 'printing-supplies', type: "Printers-Scanners/Printer-Consumables"},
                    {item: 'printing-supplies/print-cartridges', type: "Printers-Scanners/Printer-Consumables/Print-Cartridges"},
                    {item: 'printing-supplies/toner-cartridges', type: "Printers-Scanners/Printer-Consumables/Toner-Cartridges"},
                    {item: 'printing-supplies/ink-tanks', type: "Printers-Scanners/Printer-Consumables/Ink-Tanks"},
                    {item: 'printing-supplies/solid-inks', type: "Printers-Scanners/Printer-Consumables/Solid-Inks"},
                    {item: 'printing-supplies/print-heads', type: "Printers-Scanners/Printer-Consumables/Printheads"},
                    {item: 'printing-supplies/print-drum-kits', type: "Printers-Scanners/Printer-Consumables"},
                    {item: 'printing-supplies/printer-labels', type: "Printers-Scanners/Printer-Consumables/Printer-Labels"},
                    

                    {item: 'memory', type: "Storage-Memory/Memory-Upgrades-RAM"},
                    {item: 'memory/ram', type: "Storage-Memory/Memory-Upgrades-RAM"},
                    {item: 'memory/ddr2', type: "Storage-Memory/Memory-Upgrades-RAM"},
                    {item: 'memory/ddr3', type: "Storage-Memory/Memory-Upgrades-RAM"},
                    {item: 'memory/storage-media', type: "Storage-Memory/Memory-Upgrades-RAM"},
                    {item: 'memory/flash-memory', type: "Storage-Memory/Memory-Upgrades-RAM"},
                    
                    {item: 'power-protection', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'power-protection/surge-protection', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'power-protection/stand-alone-ups', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'power-protection/power-enclosures', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'power-protection/rack-mountable-ups', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'power-protection/ups-batteries', type: "Components-Accessories/Power-Protection-Devices"},
                
                  {item: 'networking', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'networking/bridges-routers', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'networking/hubs-switches', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'networking/adapters', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'networking/network-cabling', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'networking/wireless', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'networking/voip', type: "Components-Accessories/Power-Protection-Devices"},
                
                  {item: 'storage', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'storage/hard-drives', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'storage/disk-arrays', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'storage/tape-backup', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'storage/network-storage', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'storage/enclosures', type: "Components-Accessories/Power-Protection-Devices"},
                
                  {item: 'cables', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'cables/peripheral', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'cables/power-cables', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'cables/usb-cables', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'cables/serial-cables', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'cables/specific-cables', type: "Components-Accessories/Power-Protection-Devices"},
                

                  {item: 'monitors', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'monitors/computer-monitors', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'monitors/projectors', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'monitors/touchscreen', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'monitors/pos-monitors', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'monitors/medical-displays', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'monitors/televisions', type: "Components-Accessories/Power-Protection-Devices"},
                
                  {item: 'components', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'components/keyboard-mouse', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'components/batteries', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'components/web-network-cameras', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'components/fans-cooling', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'components/bags-cases', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'components/desktop-accessories', type: "Components-Accessories/Power-Protection-Devices"},
                  {item: 'components/all-accessories', type: "Components-Accessories/Power-Protection-Devices"}
                
                ];

          function isValue(system) { 
          return system.item == fullurlCategory;
      }
      nlapiLogExecution("audit","fullurlCategory before assignement",JSON.stringify(fullurlCategory));
      
      var fullurlCategoryVector = (_.find(easyAskFormattedType, function isValue(system) { 
          return system.item == fullurlCategory;
      })).type;
      var fullurlCategoryVectorVector = (_.findWhere(easyAskFormattedType, {item: fullurlCategory})).type;
      nlapiLogExecution("audit","fullurlCategoryVector after assignement",JSON.stringify(fullurlCategoryVector));

      nlapiLogExecution("audit","fullurlCategoryVectorVector after assignement",JSON.stringify(fullurlCategoryVectorVector));


        var url = "https://ea.paragonmicro.com:9114/EasyAsk/apps/Advisor.jsp?dct=paragonmicro&indexed=1&oneshot=1&disp=json&CatPath="+fullurlCategoryVectorVector+"&ResultsPerPage=12";
      
            var headers_session = {
                   "Content-Type": "application/json"
                  ,"Accept":'application/json'
                  };

            var easyask_info = nlapiRequestURL(url, "", headers_session, "GET").getBody();

            nlapiLogExecution("audit","easyask_info full",JSON.stringify(easyask_info));
                
                var ctx = ModelsInit.context;
                ctx.setSessionObject('easyAsk', easyask_info);

                return easyask_info;
            }
            catch(e){
              nlapiLogExecution("audit","error",JSON.stringify(e));
              return e
            }
<<<<<<< HEAD
          }*/
    
  })
});