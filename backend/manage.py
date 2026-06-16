#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    import os
    import sys
    import subprocess
    from pathlib import Path

    in_venv = sys.prefix != sys.base_prefix
    if not in_venv:
        try:
            root_dir = Path(__file__).resolve().parent.parent
            venv_dir = None
            for name in ['.venv', 'venv']:
                if (root_dir / name).exists():
                    venv_dir = root_dir / name
                    break
            
            if not venv_dir:
                print("Virtual environment not found. Creating .venv...")
                subprocess.check_call([sys.executable, '-m', 'venv', str(root_dir / '.venv')])
                venv_dir = root_dir / '.venv'
            
            is_win = sys.platform == 'win32'
            venv_python = str(venv_dir / ('Scripts' if is_win else 'bin') / ('python.exe' if is_win else 'python'))
            
            requirements_file = str(root_dir / 'requirements.txt')
            try:
                subprocess.check_call([venv_python, '-c', 'import django, rest_framework, pandas, sklearn, xgboost'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            except subprocess.CalledProcessError:
                print("Installing dependencies from requirements.txt...")
                subprocess.check_call([venv_python, '-m', 'pip', 'install', '-r', requirements_file])
            
            sys.exit(subprocess.call([venv_python] + sys.argv))
        except KeyboardInterrupt:
            sys.exit(0)

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
