import redis

POOL = redis.ConnectionPool(host='localhost', port=6379, decode_responses=True)

# POOL = redis.StrictRedis(host='127.0.0.1', port=6379,max_connections=1000,decode_responses=True)