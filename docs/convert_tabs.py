import os
import re

def convert_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    new_lines = []
    in_tab = False
    in_admonition = False
    indent_re = re.compile(r'^(    |\t)')
    tab_header_re = re.compile(r'^===\s+"([^"]+)"')
    admonition_re = re.compile(r'^(\?\?\?\+?)\s+(\w+)\s+"([^"]+)"')
    
    for line in lines:
        stripped = line.strip()
        
        # Check if we are in admonition and need to close it
        if in_admonition:
            if stripped:  # if line is not empty
                if not indent_re.match(line):
                    # Line is not indented and not empty -> admonition ended!
                    new_lines.append("\n</details>\n\n")
                    in_admonition = False
            # If still in admonition, unindent by 4 spaces
            if in_admonition:
                if indent_re.match(line):
                    new_lines.append(indent_re.sub('', line, 1))
                else:
                    new_lines.append(line)
                continue
                
        # Check if we are in tab and need to close it
        if in_tab:
            if stripped:
                if not indent_re.match(line):
                    in_tab = False
            if in_tab:
                if indent_re.match(line):
                    new_lines.append(indent_re.sub('', line, 1))
                else:
                    new_lines.append(line)
                continue
                
        # Check for admonition start
        match = admonition_re.match(stripped)
        if match:
            trigger = match.group(1)  # ??? or ???+
            adm_type = match.group(2) # note, info, warning, etc.
            title = match.group(3)    # Click to expand
            open_attr = " open" if "+" in trigger else ""
            
            new_lines.append(f'\n<details class="admonition {adm_type}"{open_attr}>\n<summary class="admonition-title">{title}</summary>\n\n')
            in_admonition = True
            continue
            
        # Check for tab header
        match = tab_header_re.match(stripped)
        if match:
            title = match.group(1)
            new_lines.append(f"\n#### {title}\n")
            in_tab = True
            continue
            
        new_lines.append(line)
        
    # If file ends while still in admonition or tab, close them
    if in_admonition:
        new_lines.append("\n</details>\n")
    if in_tab:
        new_lines.append("\n")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

def walk_and_convert(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                convert_file(os.path.join(root, file))

if __name__ == '__main__':
    walk_and_convert('/Users/mamarton/Documents/repositories/slim/docs/content')
    print("Successfully converted MkDocs tabs and admonitions to Hugo-compatible components!")
