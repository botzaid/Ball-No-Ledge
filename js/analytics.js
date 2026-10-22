// Vercel Web Analytics - Vanilla JavaScript Implementation
// https://vercel.com/docs/analytics

(function() {
  'use strict';

  // Initialize Vercel Analytics
  window.va = window.va || function () { 
    (window.vaq = window.vaq || []).push(arguments); 
  };

  // Create and inject the analytics script
  var script = document.createElement('script');
  script.defer = true;
  
  // The analytics script will be automatically injected by Vercel when deployed
  // In production, Vercel will replace this with the actual analytics endpoint
  script.src = '/_vercel/insights/script.js';
  
  // Append to head
  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);
})();
