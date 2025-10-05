@description('Environment name')
param environmentName string

@description('Azure location for resources')
param location string = resourceGroup().location

@description('Service name for the web application')
param webServiceName string = 'web'

// Variables
var resourceToken = uniqueString(subscription().id, resourceGroup().id, location, environmentName)
var appServicePlanName = 'asp${resourceToken}'
var appServiceName = 'app${resourceToken}'
var appInsightsName = 'ai${resourceToken}'
var logAnalyticsName = 'log${resourceToken}'
var managedIdentityName = 'mi${resourceToken}'

// Managed Identity (Required by AZD rules)
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: managedIdentityName
  location: location
}

// Log Analytics Workspace
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
    Flow_Type: 'Redfield'
    Request_Source: 'IbizaWebAppExtensionCreate'
  }
}

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
    size: 'B1'
    family: 'B'
    capacity: 1
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// App Service
resource appService 'Microsoft.Web/sites@2023-01-01' = {
  name: appServiceName
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  tags: {
    'azd-service-name': webServiceName
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appCommandLine: 'npm start'
      alwaysOn: true
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      scmMinTlsVersion: '1.2'
      use32BitWorkerProcess: false
      webSocketsEnabled: false
      appSettings: [
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true'
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
      ]
    }
    httpsOnly: true
    clientAffinityEnabled: false
  }
}

// App Service Site Extension (Required by AZD rules for App Service)
resource appServiceSiteExtension 'Microsoft.Web/sites/siteextensions@2023-01-01' = {
  parent: appService
  name: 'Microsoft.ApplicationInsights.AzureWebSites'
}

// Output required by AZD rules
output RESOURCE_GROUP_ID string = resourceGroup().id
output AZURE_APP_SERVICE_URL string = 'https://${appService.properties.defaultHostName}'
output AZURE_APP_SERVICE_NAME string = appService.name
output APPLICATIONINSIGHTS_CONNECTION_STRING string = appInsights.properties.ConnectionString
