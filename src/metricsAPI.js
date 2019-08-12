import ReactAI from 'react-appinsights';
import { createBrowserHistory } from 'history';
import axios from 'axios';
import uuidv4 from 'uuid';
import { APPINSIGHTS } from '../config';
import Cookie from '../util/cookie';

let hasAppInsights = false;
let appInsightsInstance = null;
let originUrl = null;
let metricsSessionProperties = null;

function getElapsedTime(config) {
  return Date.now() - config.requestStartTime;
}

function generateCorrelationId() {
  // Gerando o Id para correlação dos logs do AppInsights
  return uuidv4.v4().replace(/-/g, '');
}

function configureMetricSession() {
  const metricsSessionId = generateCorrelationId();
  let googleAnalyticsId = Cookie.getCookie('_ga');
  let googleId = Cookie.getCookie('_gid');

  if (!googleId) googleId = 'N/A';
  if (!googleAnalyticsId) googleAnalyticsId = 'N/A';

  metricsSessionProperties = {
    metricsId: metricsSessionId,
    channel: 'AreaLogada',
    layer: 'UserInterface',
    googleId,
    googleAnalyticsId,
  };
}

function configureAppInsights() {
  // Configurando Application Insights
  const history = createBrowserHistory();
  ReactAI.init({ instrumentationKey: APPINSIGHTS }, history);
  ReactAI.setAppContext({ urlReferrer: document.referrer });

  appInsightsInstance = ReactAI.ai();
  hasAppInsights = true;
}

function trackDependencyMetric(response) {
  if (response.config.url !== undefined && response.config.url !== '' && response.config.url.indexOf('localhost') < 0) {
    const responseText = (response.request !== undefined && response.request.status === 500 ? response.request.responseText : '');
    const responseData = JSON.stringify({
      status: response.status,
      statusText: response.statusText,
      responseText,
      message: response.message,
    });

    response.config.requestElapsedTime = getElapsedTime(response.config);
    if (hasAppInsights) {
      const properties = {
        ...metricsSessionProperties,
        responseData,
        request_Id: response.config.requestId,
      };

      appInsightsInstance.trackDependency(response.config.requestId, response.config.method, response.config.url, '', response.config.requestElapsedTime, response.status !== 500, response.status, properties);
    }
  }
}


function configureDependencyMetrics() {
  // Interceptors que farão as métricas de dependências
  axios.interceptors.request.use((config) => {
    // Gerando o RequestId para correlação dos logs do AppInsights
    const requestid = generateCorrelationId();
    const requestConfig = config;
    requestConfig.headers = {
      ...config.headers,
      'X-TLM-metricsId': metricsSessionProperties.metricsId,
      'X-TLM-channel': metricsSessionProperties.channel,
      'X-TLM-layer': 'Service',
      'Request-id': requestid,
    };
    requestConfig.requestId = requestid;
    requestConfig.requestStartTime = Date.now();
    return requestConfig;
  }, error => Promise.reject(error));

  axios.interceptors.response.use((response) => {
    trackDependencyMetric(response);
    return response;
  }, (error) => {
    trackDependencyMetric(error.response);
    return Promise.reject(error);
  });
}

export function setAuthenticatedUser(userId) {
  let userAccountId = userId;
  if (userAccountId && userAccountId.length > 0) {
    userAccountId = userAccountId.replace(/-/g, '')
      .replace(/;/g, '')
      .replace(/./g, '')
      .replace(/ /g, '')
      .replace(/=/g, '')
      .replace(/|/g, '')
      .replace(/´/g, '');

    if (hasAppInsights) {
      const { metricsSessionId } = metricsSessionProperties;
      appInsightsInstance.setAuthenticatedUserContext(userId, metricsSessionId, true);
    }
  }
}

export function clearAuthenticatedUser() {
  if (hasAppInsights) {
    appInsightsInstance.clearAuthenticatedUserContext();
  }
}

export function setPageView(viewName, pageViewRouteUrl, pageUrl) {
  if (hasAppInsights) {
    const properties = { ...metricsSessionProperties, pageUrl };
    appInsightsInstance.trackPageView(viewName, pageViewRouteUrl, properties);
  }
}

export function enableMetrics(enableAppInsights, enableGoogleAnalytics) {
  if (document.referrer !== undefined
    && document.referrer.indexOf(document.location.hostname) < 0) {
    originUrl = document.referrer;
  }

  configureMetricSession();

  if (enableAppInsights) {
    configureAppInsights();
    if (originUrl) {
      setPageView(`Url de origem: ${originUrl}`, originUrl);
    }
  }

  configureDependencyMetrics();
}

export default enableMetrics;
