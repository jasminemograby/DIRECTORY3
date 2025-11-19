// Presentation Layer - Universal Endpoint Controller
// Handles requests from other microservices via /api/fill-content-metrics

const FillContentMetricsUseCase = require('../application/FillContentMetricsUseCase');

class UniversalEndpointController {
  constructor() {
    this.fillContentMetricsUseCase = new FillContentMetricsUseCase();
  }

  /**
   * Handle universal endpoint request
   * POST /api/fill-content-metrics
   */
  async handleRequest(req, res) {
    try {
      // Parse request body (should be stringified JSON)
      let envelope;
      if (typeof req.body === 'string') {
        envelope = JSON.parse(req.body);
      } else {
        envelope = req.body;
      }

      // Validate envelope structure
      if (!envelope || typeof envelope !== 'object') {
        return res.status(400).send(JSON.stringify({
          requester_service: envelope?.requester_service || 'unknown',
          payload: envelope?.payload || {},
          response: {
            error: 'Invalid request format. Expected envelope with requester_service, payload, and response fields.'
          }
        }));
      }

      const { requester_service, payload, response } = envelope;

      // Validate required fields
      if (!requester_service || typeof requester_service !== 'string') {
        return res.status(400).send(JSON.stringify({
          requester_service: 'unknown',
          payload: payload || {},
          response: {
            error: 'Missing or invalid requester_service field'
          }
        }));
      }

      if (!payload || typeof payload !== 'object') {
        return res.status(400).send(JSON.stringify({
          requester_service,
          payload: {},
          response: {
            error: 'Missing or invalid payload field'
          }
        }));
      }

      if (!response || typeof response !== 'object') {
        return res.status(400).send(JSON.stringify({
          requester_service,
          payload,
          response: {
            error: 'Missing or invalid response template field'
          }
        }));
      }

      console.log('[UniversalEndpointController] Received request from:', requester_service);
      console.log('[UniversalEndpointController] Payload:', JSON.stringify(payload));
      console.log('[UniversalEndpointController] Response template:', JSON.stringify(response));

      // Execute use case to fill response
      const filledResponse = await this.fillContentMetricsUseCase.execute(
        payload,
        response,
        requester_service
      );

      // Build response envelope
      const responseEnvelope = {
        requester_service,
        payload,
        response: filledResponse
      };

      // Return stringified JSON
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(responseEnvelope));

    } catch (error) {
      console.error('[UniversalEndpointController] Error:', error);

      // Return error in envelope structure
      const errorEnvelope = {
        requester_service: req.body?.requester_service || 'unknown',
        payload: req.body?.payload || {},
        response: {
          error: error.message || 'An error occurred while processing the request'
        }
      };

      res.status(500).send(JSON.stringify(errorEnvelope));
    }
  }
}

module.exports = UniversalEndpointController;

