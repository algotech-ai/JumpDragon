import http.server
import socketserver
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import threading
import os

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

class FileChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith(('.html', '.js', '.css')):
            print(f"\n检测到文件变化: {event.src_path}")
            print("请刷新浏览器页面以查看更新")

def start_server():
    print(f"启动服务器在端口 {PORT}...")
    print(f"请在浏览器中访问: http://localhost:{PORT}")
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("按 Ctrl+C 停止服务器")
        httpd.serve_forever()

def start_file_watcher():
    event_handler = FileChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path='.', recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    # 启动文件监控线程
    watcher_thread = threading.Thread(target=start_file_watcher)
    watcher_thread.daemon = True
    watcher_thread.start()
    
    # 启动服务器
    start_server() 