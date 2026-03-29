// Generic fallback starter code templates used when a problem has
// no per-language starterCode. Each template reads raw stdin, calls
// solution(), and prints the result — so they work inside Docker containers.
export const CODE_TEMPLATES: Record<string, string> = {
  python: `import sys
import json

def solution(data):
    """
    data: raw stdin string (strip/split as needed)
    e.g.  lines = data.split('\\n')
          nums  = json.loads(lines[0])
    """
    # Write your code here
    pass

# Do not modify below this line
if __name__ == "__main__":
    data = sys.stdin.read().strip()
    result = solution(data)
    if result is not None:
        print(result)`,

  javascript: `function solution(data) {
    // data: raw stdin string (split/parse as needed)
    // e.g.  const lines = data.split('\\n');
    //       const nums  = JSON.parse(lines[0]);
    // Write your code here
}

// Do not modify below this line
process.stdin.resume();
process.stdin.setEncoding('utf8');
let _input = '';
process.stdin.on('data', d => _input += d);
process.stdin.on('end', () => {
    const result = solution(_input.trim());
    if (result !== undefined && result !== null) console.log(result);
});`,

  typescript: `function solution(data: string): string | number | null {
    // data: raw stdin string (split/parse as needed)
    // e.g.  const lines = data.split('\\n');
    //       const nums  = JSON.parse(lines[0]);
    // Write your code here
    return null;
}

// Do not modify below this line
process.stdin.resume();
process.stdin.setEncoding('utf8');
let _input = '';
process.stdin.on('data', (d: string) => _input += d);
process.stdin.on('end', () => {
    const result = solution(_input.trim());
    if (result !== undefined && result !== null) console.log(result);
});`,

  java: `import java.util.*;
import java.io.*;

class Solution {
    public static String solve(String data) {
        // Parse data however your problem needs:
        // String[] lines = data.split("\\\\n");
        // int[] nums = Arrays.stream(lines[0].split(",")).mapToInt(Integer::parseInt).toArray();
        // Write your code here
        return "";
    }
}

// Do not modify below this line
public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) sb.append(line).append('\\n');
        String result = Solution.solve(sb.toString().trim());
        System.out.println(result);
    }
}`,

  cpp: `#include <iostream>
#include <string>
#include <sstream>
using namespace std;

string solution(const string& data) {
    // Parse data however your problem needs:
    // istringstream iss(data);
    // int n; iss >> n;
    // Write your code here
    return "";
}

// Do not modify below this line
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    istreambuf_iterator<char> begin(cin), end;
    string data(begin, end);
    if (!data.empty() && data.back() == '\\n') data.pop_back();
    cout << solution(data) << endl;
    return 0;
}`,
};

export function getTemplateForProblem(language: string): string {
  return CODE_TEMPLATES[language] ?? CODE_TEMPLATES['javascript'];
}

// Legacy export kept for any remaining imports
export function getEditableRegion(_template: string): [number, number] | null {
  return null;
}

