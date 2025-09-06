import json
from urllib.parse import unquote


from app.routes.admin_routes import (
    get_all_products,
    create_product,
    get_product_by_id,
    update_product,
    delete_product,
    get_all_orders,
    get_order_by_id,
    update_order,
    delete_order,
)


from app.routes.user_routes import (
    list_products,
    product_detail,
    create_order_user,
)


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",            # Allow all origins (use specific domain in prod)
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        },
        "body": json.dumps(body),
    }


def lambda_handler(event, context):
    print("Received event:", json.dumps(event))

    # Handle preflight OPTIONS request for CORS
    if event.get("httpMethod", "") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            },
            "body": "",
        }

    http_method = event.get("httpMethod", "")
    raw_path = event.get("rawPath") or event.get("path", "")

    # Remove stage prefix if present (e.g., /live, /$default)
    stage_prefixes = ["/live", "/$default"]
    for prefix in stage_prefixes:
        if raw_path.startswith(prefix):
            raw_path = raw_path[len(prefix):] or "/"

    path = raw_path[:-1] if raw_path.endswith("/") and len(raw_path) > 1 else raw_path

    # Get path params if present
    path_params = event.get("pathParameters") or {}
    resource_id = path_params.get("id")
    
    print("DEBUG: path =", path)
    print("DEBUG: resource_id =", resource_id)

    try:
        body = event.get("body")
        if body and event.get("isBase64Encoded", False):
            import base64
            body = base64.b64decode(body).decode("utf-8")
        json_body = json.loads(body) if body else None
    except Exception:
        return response(400, {"error": "Invalid JSON body"})

    # Home check
    if path == "/" and http_method == "GET":
        return response(200, {"message": "Flask Order & Product API is running"})

    # Admin routes
    if path == "/admin/products":
        if http_method == "GET":
            return response(200, get_all_products())
        if http_method == "POST":
            return response(201, create_product(json_body))

    # Single product by ID (GET, PUT, DELETE)
    if path.startswith("/products/"):
        product_id = path.split("/products/")[1] if not resource_id else resource_id
        if http_method == "GET":
            return response(*product_detail(product_id))
        if http_method == "PUT":
            return response(*update_product(product_id, json_body))
        if http_method == "DELETE":
            return response(*delete_product(product_id))

    # Admin product by ID for admin routes
    if path.startswith("/admin/products/"):
        product_id = path.split("/admin/products/")[1] if not resource_id else resource_id
        if http_method == "GET":
            return response(*get_product_by_id(product_id))
        if http_method == "PUT":
            return response(*update_product(product_id, json_body))
        if http_method == "DELETE":
            return response(*delete_product(product_id))

    if path == "/admin/orders":
        if http_method == "GET":
            return response(200, get_all_orders())

    if path.startswith("/admin/orders/") and resource_id:
        if http_method == "GET":
            return response(*get_order_by_id(resource_id))
        if http_method == "PUT":
            return response(*update_order(resource_id, json_body))
        if http_method == "DELETE":
            return response(*delete_order(resource_id))

    # User routes
    if path == "/products":
        if http_method == "GET":
            return response(200, list_products())

    if path == "/orders" and http_method == "POST":
        return response(201, create_order_user(json_body))

    return response(404, {"error": "Not Found"})
