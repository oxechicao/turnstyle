#!/bin/bash

# Shell Script Syntax Example File for Theme Testing
# This file demonstrates various bash/shell script patterns and syntax highlighting

# ===== VARIABLES AND CONSTANTS =====
readonly SCRIPT_NAME="$(basename "$0")"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly VERSION="1.0.0"

# String variables
APP_NAME="Theme Test Application"
CONFIG_FILE="/etc/myapp/config.conf"
LOG_FILE="/var/log/myapp.log"
BACKUP_DIR="/backup/$(date +%Y%m%d)"

# Numeric variables
MAX_RETRIES=3
TIMEOUT=30
PORT=8080
PID=$$

# Arrays
declare -a SUPPORTED_FORMATS=("json" "yaml" "xml" "csv")
declare -A CONFIG_OPTIONS=(
    ["debug"]="true"
    ["log_level"]="info"
    ["max_connections"]="100"
)

# Environment variables with defaults
USER_HOME="${HOME:-/tmp}"
SHELL_TYPE="${SHELL:-/bin/bash}"
EDITOR="${EDITOR:-vim}"

# ===== COLOR DEFINITIONS =====
# ANSI color codes for terminal output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly WHITE='\033[1;37m'
readonly BOLD='\033[1m'
readonly NC='\033[0m' # No Color

# ===== FUNCTIONS =====

# Simple function
print_usage() {
    cat << EOF
Usage: $SCRIPT_NAME [OPTIONS] [COMMAND]

OPTIONS:
    -h, --help          Show this help message
    -v, --version       Show version information
    -d, --debug         Enable debug mode
    -c, --config FILE   Use custom config file
    -o, --output DIR    Set output directory

COMMANDS:
    install             Install the application
    uninstall           Remove the application
    start               Start the service
    stop                Stop the service
    restart             Restart the service
    status              Show service status

EXAMPLES:
    $SCRIPT_NAME --config /custom/config.conf start
    $SCRIPT_NAME -d install
    $SCRIPT_NAME status

EOF
}

# Function with parameters and return values
calculate_checksum() {
    local file="$1"
    local algorithm="${2:-sha256}"
    
    if [[ ! -f "$file" ]]; then
        echo "Error: File '$file' not found" >&2
        return 1
    fi
    
    case "$algorithm" in
        md5)
            md5sum "$file" | cut -d' ' -f1
            ;;
        sha1)
            sha1sum "$file" | cut -d' ' -f1
            ;;
        sha256)
            sha256sum "$file" | cut -d' ' -f1
            ;;
        *)
            echo "Error: Unsupported algorithm '$algorithm'" >&2
            return 2
            ;;
    esac
}

# Function with advanced parameter handling
process_files() {
    local -r operation="$1"
    shift
    local files=("$@")
    
    if [[ ${#files[@]} -eq 0 ]]; then
        echo "No files specified" >&2
        return 1
    fi
    
    for file in "${files[@]}"; do
        case "$operation" in
            backup)
                backup_file "$file"
                ;;
            compress)
                compress_file "$file"
                ;;
            analyze)
                analyze_file "$file"
                ;;
            *)
                echo "Unknown operation: $operation" >&2
                return 1
                ;;
        esac
    done
}

# Logging function with different levels
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$level" in
        DEBUG)
            [[ "$DEBUG" == "true" ]] && echo -e "${CYAN}[$timestamp] DEBUG: $message${NC}" >&2
            ;;
        INFO)
            echo -e "${GREEN}[$timestamp] INFO: $message${NC}"
            ;;
        WARN)
            echo -e "${YELLOW}[$timestamp] WARN: $message${NC}" >&2
            ;;
        ERROR)
            echo -e "${RED}[$timestamp] ERROR: $message${NC}" >&2
            ;;
        FATAL)
            echo -e "${RED}${BOLD}[$timestamp] FATAL: $message${NC}" >&2
            exit 1
            ;;
        *)
            echo "[$timestamp] $level: $message"
            ;;
    esac
}

# Function demonstrating various bash features
advanced_operations() {
    local input_file="$1"
    local output_dir="$2"
    
    # Parameter expansion examples
    local filename="${input_file##*/}"           # basename
    local extension="${filename##*.}"            # file extension
    local basename="${filename%.*}"              # filename without extension
    local parent_dir="${input_file%/*}"          # dirname
    
    log INFO "Processing file: $filename"
    log DEBUG "Extension: $extension, Basename: $basename"
    
    # Conditional parameter expansion
    local output_file="${output_dir:+$output_dir/}${basename}.processed"
    local backup_suffix="${BACKUP_SUFFIX:-bak}"
    
    # Command substitution
    local file_size
    file_size=$(stat -c%s "$input_file" 2>/dev/null || stat -f%z "$input_file" 2>/dev/null)
    local file_type
    file_type=$(file -b "$input_file")
    
    log INFO "File size: ${file_size:-unknown} bytes"
    log INFO "File type: $file_type"
    
    # Arithmetic operations
    local size_mb=$((file_size / 1024 / 1024))
    local processing_time=$((RANDOM % 10 + 1))
    
    if (( size_mb > 100 )); then
        log WARN "Large file detected (${size_mb}MB), processing may take longer"
    fi
    
    # Process simulation with progress
    for ((i=1; i<=processing_time; i++)); do
        local percent=$((i * 100 / processing_time))
        printf "\rProgress: [%-20s] %d%%" $(printf "%*s" $((percent/5)) | tr ' ' '=') "$percent"
        sleep 0.5
    done
    echo
    
    return 0
}

# Error handling function
handle_error() {
    local exit_code=$?
    local line_number=$1
    
    log ERROR "Script failed at line $line_number with exit code $exit_code"
    
    # Cleanup on error
    if [[ -n "$TEMP_DIR" && -d "$TEMP_DIR" ]]; then
        log INFO "Cleaning up temporary directory: $TEMP_DIR"
        rm -rf "$TEMP_DIR"
    fi
    
    exit "$exit_code"
}

# Network operations
check_connectivity() {
    local host="${1:-google.com}"
    local port="${2:-80}"
    local timeout="${3:-5}"
    
    log INFO "Checking connectivity to $host:$port"
    
    if command -v nc >/dev/null 2>&1; then
        if nc -z -w "$timeout" "$host" "$port" 2>/dev/null; then
            log INFO "Connection to $host:$port successful"
            return 0
        else
            log ERROR "Cannot connect to $host:$port"
            return 1
        fi
    elif command -v curl >/dev/null 2>&1; then
        if curl -s --connect-timeout "$timeout" "http://$host:$port" >/dev/null 2>&1; then
            log INFO "Connection to $host:$port successful"
            return 0
        else
            log ERROR "Cannot connect to $host:$port"
            return 1
        fi
    else
        log WARN "Neither nc nor curl available, cannot test connectivity"
        return 2
    fi
}

# File operations with validation
backup_file() {
    local source_file="$1"
    local backup_dir="${2:-$BACKUP_DIR}"
    
    # Input validation
    if [[ ! -f "$source_file" ]]; then
        log ERROR "Source file '$source_file' does not exist"
        return 1
    fi
    
    # Create backup directory if it doesn't exist
    if [[ ! -d "$backup_dir" ]]; then
        log INFO "Creating backup directory: $backup_dir"
        mkdir -p "$backup_dir" || {
            log ERROR "Failed to create backup directory: $backup_dir"
            return 1
        }
    fi
    
    # Generate backup filename with timestamp
    local timestamp
    timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$backup_dir/$(basename "$source_file").$timestamp.bak"
    
    # Perform backup
    if cp "$source_file" "$backup_file"; then
        log INFO "File backed up to: $backup_file"
        
        # Calculate and log checksums
        local source_checksum
        local backup_checksum
        source_checksum=$(calculate_checksum "$source_file")
        backup_checksum=$(calculate_checksum "$backup_file")
        
        if [[ "$source_checksum" == "$backup_checksum" ]]; then
            log INFO "Backup verification successful"
        else
            log ERROR "Backup verification failed - checksums don't match"
            return 1
        fi
    else
        log ERROR "Failed to backup file: $source_file"
        return 1
    fi
}

# Database operations simulation
database_operations() {
    local db_name="$1"
    local operation="$2"
    
    # Simulate database connection
    log INFO "Connecting to database: $db_name"
    
    case "$operation" in
        backup)
            log INFO "Starting database backup..."
            # Simulate long-running operation
            for i in {1..5}; do
                log DEBUG "Backing up table $i of 5..."
                sleep 1
            done
            log INFO "Database backup completed"
            ;;
        restore)
            log INFO "Starting database restore..."
            # Confirmation prompt
            read -p "Are you sure you want to restore the database? (yes/no): " -r
            if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
                log INFO "Restoring database..."
                sleep 2
                log INFO "Database restore completed"
            else
                log INFO "Database restore cancelled"
            fi
            ;;
        optimize)
            log INFO "Optimizing database..."
            # Simulate optimization with progress
            local tables=("users" "products" "orders" "logs" "sessions")
            for table in "${tables[@]}"; do
                log DEBUG "Optimizing table: $table"
                sleep 0.5
            done
            log INFO "Database optimization completed"
            ;;
        *)
            log ERROR "Unknown database operation: $operation"
            return 1
            ;;
    esac
}

# ===== MAIN SCRIPT LOGIC =====

# Set error handling
set -euo pipefail
trap 'handle_error $LINENO' ERR

# Initialize variables
DEBUG=false
VERBOSE=false
CONFIG_FILE=""
OUTPUT_DIR=""
COMMAND=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            print_usage
            exit 0
            ;;
        -v|--version)
            echo "$SCRIPT_NAME version $VERSION"
            exit 0
            ;;
        -d|--debug)
            DEBUG=true
            log DEBUG "Debug mode enabled"
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        -c|--config)
            CONFIG_FILE="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        install|uninstall|start|stop|restart|status|test)
            COMMAND="$1"
            shift
            ;;
        --)
            shift
            break
            ;;
        -*)
            log ERROR "Unknown option: $1"
            print_usage
            exit 1
            ;;
        *)
            break
            ;;
    esac
done

# Validate environment
log INFO "Starting $SCRIPT_NAME v$VERSION"
log DEBUG "Script directory: $SCRIPT_DIR"
log DEBUG "Running as user: $(whoami)"
log DEBUG "Shell: $SHELL_TYPE"

# Check dependencies
DEPENDENCIES=("curl" "jq" "tar" "gzip")
MISSING_DEPS=()

for dep in "${DEPENDENCIES[@]}"; do
    if ! command -v "$dep" >/dev/null 2>&1; then
        MISSING_DEPS+=("$dep")
    fi
done

if [[ ${#MISSING_DEPS[@]} -gt 0 ]]; then
    log WARN "Missing dependencies: ${MISSING_DEPS[*]}"
    log INFO "Please install missing dependencies before continuing"
fi

# Load configuration if specified
if [[ -n "$CONFIG_FILE" ]]; then
    if [[ -f "$CONFIG_FILE" ]]; then
        log INFO "Loading configuration from: $CONFIG_FILE"
        # shellcheck source=/dev/null
        source "$CONFIG_FILE"
    else
        log ERROR "Configuration file not found: $CONFIG_FILE"
        exit 1
    fi
fi

# Create temporary directory
TEMP_DIR=$(mktemp -d)
log DEBUG "Created temporary directory: $TEMP_DIR"

# Cleanup function for temporary files
cleanup() {
    if [[ -n "$TEMP_DIR" && -d "$TEMP_DIR" ]]; then
        log DEBUG "Cleaning up temporary directory: $TEMP_DIR"
        rm -rf "$TEMP_DIR"
    fi
}
trap cleanup EXIT

# Execute command
case "${COMMAND:-}" in
    install)
        log INFO "Installing application..."
        
        # Pre-installation checks
        if [[ $EUID -eq 0 ]]; then
            log INFO "Running as root - installation permitted"
        else
            log WARN "Not running as root - some features may be limited"
        fi
        
        # System information
        log INFO "System information:"
        log INFO "  OS: $(uname -s)"
        log INFO "  Architecture: $(uname -m)"
        log INFO "  Kernel: $(uname -r)"
        
        # Disk space check
        local available_space
        available_space=$(df -h / | awk 'NR==2 {print $4}')
        log INFO "Available disk space: $available_space"
        
        # Installation simulation
        local install_steps=(
            "Downloading packages"
            "Verifying signatures"
            "Installing dependencies"
            "Configuring system"
            "Starting services"
        )
        
        for step in "${install_steps[@]}"; do
            log INFO "$step..."
            sleep 1
        done
        
        log INFO "Installation completed successfully"
        ;;
        
    uninstall)
        log INFO "Uninstalling application..."
        
        # Confirmation with timeout
        if read -t 10 -p "This will remove all data. Continue? (yes/no): " -r; then
            if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
                log INFO "Proceeding with uninstallation..."
                sleep 2
                log INFO "Uninstallation completed"
            else
                log INFO "Uninstallation cancelled"
            fi
        else
            log INFO "No response received, cancelling uninstallation"
        fi
        ;;
        
    start)
        log INFO "Starting service..."
        
        # Check if already running
        if pgrep -f "$APP_NAME" >/dev/null; then
            log WARN "Service appears to be already running"
            exit 1
        fi
        
        # Start service simulation
        log INFO "Service started successfully (PID: $PID)"
        ;;
        
    stop)
        log INFO "Stopping service..."
        
        # Find and stop processes
        if pgrep -f "$APP_NAME" >/dev/null; then
            log INFO "Stopping processes..."
            # pkill -f "$APP_NAME"
            log INFO "Service stopped successfully"
        else
            log INFO "Service is not running"
        fi
        ;;
        
    restart)
        log INFO "Restarting service..."
        $0 stop
        sleep 2
        $0 start
        ;;
        
    status)
        log INFO "Checking service status..."
        
        # System load
        local load_avg
        load_avg=$(uptime | awk -F'load average:' '{print $2}')
        log INFO "System load:$load_avg"
        
        # Memory usage
        if command -v free >/dev/null 2>&1; then
            local memory_info
            memory_info=$(free -h | awk 'NR==2{printf "Memory: %s/%s (%.2f%%)", $3,$2,$3*100/$2}')
            log INFO "$memory_info"
        fi
        
        # Process information
        if pgrep -f "$APP_NAME" >/dev/null; then
            log INFO "Service is running"
            # Show process details
            ps aux | grep -E "(PID|$APP_NAME)" | grep -v grep
        else
            log INFO "Service is not running"
        fi
        ;;
        
    test)
        log INFO "Running system tests..."
        
        # Test network connectivity
        check_connectivity "github.com" 443
        
        # Test file operations
        local test_file="$TEMP_DIR/test_file.txt"
        echo "Test content $(date)" > "$test_file"
        backup_file "$test_file"
        
        # Test advanced operations
        advanced_operations "$test_file" "$TEMP_DIR"
        
        # Test database operations (simulation)
        database_operations "test_db" "optimize"
        
        log INFO "All tests completed successfully"
        ;;
        
    "")
        log ERROR "No command specified"
        print_usage
        exit 1
        ;;
        
    *)
        log ERROR "Unknown command: $COMMAND"
        print_usage
        exit 1
        ;;
esac

# ===== ADDITIONAL SYNTAX EXAMPLES =====

# Here documents and string manipulation
generate_config() {
    cat > "$TEMP_DIR/config.conf" << 'EOF'
# Configuration file generated by script
[database]
host = localhost
port = 5432
username = admin
password = secret

[logging]
level = info
file = /var/log/app.log
rotate = daily

[features]
debug = false
cache = true
compression = enabled
EOF
}

# Complex conditional expressions
validate_input() {
    local input="$1"
    
    # Multiple conditions with logical operators
    if [[ -n "$input" && "$input" =~ ^[a-zA-Z0-9_-]+$ && ${#input} -ge 3 && ${#input} -le 50 ]]; then
        log INFO "Input validation passed"
        return 0
    elif [[ -z "$input" ]]; then
        log ERROR "Input cannot be empty"
        return 1
    elif [[ ! "$input" =~ ^[a-zA-Z0-9_-]+$ ]]; then
        log ERROR "Input contains invalid characters"
        return 1
    elif [[ ${#input} -lt 3 ]]; then
        log ERROR "Input too short (minimum 3 characters)"
        return 1
    elif [[ ${#input} -gt 50 ]]; then
        log ERROR "Input too long (maximum 50 characters)"
        return 1
    else
        log ERROR "Input validation failed"
        return 1
    fi
}

# Advanced array operations
process_data() {
    local -a data_sources=("/var/log/app.log" "/var/log/system.log" "/var/log/error.log")
    local -a processed_files=()
    local -A file_stats=()
    
    # Process each data source
    for source in "${data_sources[@]}"; do
        if [[ -f "$source" ]]; then
            log INFO "Processing: $source"
            
            # File statistics
            local line_count word_count char_count
            read -r line_count word_count char_count < <(wc "$source")
            
            file_stats["$source"]="lines:$line_count words:$word_count chars:$char_count"
            processed_files+=("$source")
            
            # Sample file content analysis
            local error_count warning_count info_count
            error_count=$(grep -c "ERROR" "$source" 2>/dev/null || echo "0")
            warning_count=$(grep -c "WARN" "$source" 2>/dev/null || echo "0") 
            info_count=$(grep -c "INFO" "$source" 2>/dev/null || echo "0")
            
            log DEBUG "  Errors: $error_count, Warnings: $warning_count, Info: $info_count"
        else
            log WARN "Data source not found: $source"
        fi
    done
    
    # Summary report
    log INFO "Processing summary:"
    log INFO "  Processed files: ${#processed_files[@]}"
    log INFO "  Skipped files: $((${#data_sources[@]} - ${#processed_files[@]}))"
    
    # Display file statistics
    for file in "${processed_files[@]}"; do
        log INFO "  $file: ${file_stats[$file]}"
    done
}

# Regex patterns and text processing
analyze_logs() {
    local log_file="$1"
    
    if [[ ! -f "$log_file" ]]; then
        log ERROR "Log file not found: $log_file"
        return 1
    fi
    
    log INFO "Analyzing log file: $log_file"
    
    # IP address extraction
    local ip_pattern='([0-9]{1,3}\.){3}[0-9]{1,3}'
    local unique_ips
    unique_ips=$(grep -oE "$ip_pattern" "$log_file" 2>/dev/null | sort -u | wc -l)
    log INFO "Unique IP addresses: ${unique_ips:-0}"
    
    # Date range analysis
    local date_pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
    local first_date last_date
    first_date=$(grep -oE "$date_pattern" "$log_file" 2>/dev/null | head -1)
    last_date=$(grep -oE "$date_pattern" "$log_file" 2>/dev/null | tail -1)
    
    if [[ -n "$first_date" && -n "$last_date" ]]; then
        log INFO "Date range: $first_date to $last_date"
    fi
    
    # HTTP status code analysis
    local status_codes
    status_codes=$(grep -oE 'HTTP/[0-9.]+ [0-9]{3}' "$log_file" 2>/dev/null | \
                   awk '{print $2}' | sort | uniq -c | sort -nr)
    
    if [[ -n "$status_codes" ]]; then
        log INFO "HTTP status code distribution:"
        while IFS= read -r line; do
            log INFO "  $line"
        done <<< "$status_codes"
    fi
}

# Mathematical operations and calculations
performance_metrics() {
    local start_time="$1"
    local end_time="$2"
    local operation_count="$3"
    
    # Calculate duration
    local duration=$((end_time - start_time))
    local minutes=$((duration / 60))
    local seconds=$((duration % 60))
    
    log INFO "Performance metrics:"
    log INFO "  Duration: ${minutes}m ${seconds}s"
    log INFO "  Operations: $operation_count"
    
    # Calculate operations per second
    if [[ $duration -gt 0 ]]; then
        local ops_per_second=$((operation_count / duration))
        log INFO "  Operations per second: $ops_per_second"
    fi
    
    # Memory usage calculation (example)
    local memory_usage
    memory_usage=$(ps -o pid,ppid,pmem,rss,vsz,comm -p $$ | tail -1)
    log INFO "  Memory usage: $memory_usage"
}

# Signal handling
handle_signals() {
    log INFO "Setting up signal handlers..."
    
    # Graceful shutdown on SIGTERM
    trap 'log INFO "Received SIGTERM, shutting down gracefully..."; cleanup; exit 0' TERM
    
    # Handle SIGINT (Ctrl+C)
    trap 'log INFO "Received SIGINT, cleaning up..."; cleanup; exit 1' INT
    
    # Handle SIGHUP (reload configuration)
    trap 'log INFO "Received SIGHUP, reloading configuration..."; reload_config' HUP
}

reload_config() {
    log INFO "Reloading configuration..."
    if [[ -f "$CONFIG_FILE" ]]; then
        # shellcheck source=/dev/null
        source "$CONFIG_FILE"
        log INFO "Configuration reloaded successfully"
    else
        log WARN "No configuration file to reload"
    fi
}

# Final message
log INFO "Script execution completed successfully"
log DEBUG "Total runtime: $SECONDS seconds"

# Exit with success
exit 0
