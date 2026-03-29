// Language-specific templates with proper I/O handling for Two Sum problem

export const twoSumTemplates = {
  javascript: `function twoSum(nums, target) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const lines = [];
rl.on('line', (line) => {
    lines.push(line);
});

rl.on('close', () => {
    const nums = JSON.parse(lines[0]);
    const target = parseInt(lines[1]);
    const result = twoSum(nums, target);
    console.log(JSON.stringify(result));
});`,

  python: `def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Write your code here
    pass

# Do not modify below this line
if __name__ == "__main__":
    import sys
    import json
    nums = json.loads(sys.stdin.readline().strip())
    target = int(sys.stdin.readline().strip())
    result = twoSum(nums, target)
    print(json.dumps(result))`,

  java: `import java.util.*;
import java.io.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}

// Do not modify below this line
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Read array
        String arrayStr = sc.nextLine().trim();
        arrayStr = arrayStr.substring(1, arrayStr.length() - 1); // Remove [ ]
        String[] parts = arrayStr.split(",");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        
        // Read target
        int target = Integer.parseInt(sc.nextLine().trim());
        
        Solution solution = new Solution();
        int[] result = solution.twoSum(nums, target);
        
        System.out.print("[");
        for (int i = 0; i < result.length; i++) {
            System.out.print(result[i]);
            if (i < result.length - 1) System.out.print(",");
        }
        System.out.println("]");
    }
}`,

  cpp: `#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};

// Do not modify below this line
int main() {
    string line;
    
    // Read array
    getline(cin, line);
    vector<int> nums;
    line = line.substr(1, line.length() - 2); // Remove [ ]
    stringstream ss(line);
    string token;
    while (getline(ss, token, ',')) {
        nums.push_back(stoi(token));
    }
    
    // Read target
    int target;
    cin >> target;
    
    Solution solution;
    vector<int> result = solution.twoSum(nums, target);
    
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    
    return 0;
}`,
};

export const reverseStringTemplates = {
  javascript: `function reverseString(s) {
    // Write your code here
    // Note: Modify the array in-place and return it
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const lines = [];
rl.on('line', (line) => {
    lines.push(line);
});

rl.on('close', () => {
    const s = JSON.parse(lines[0]);
    const result = reverseString(s);
    // Accept both in-place (return undefined) and return-value styles
    console.log(JSON.stringify(result !== undefined ? result : s));
});`,

  python: `def reverseString(s):
    """
    :type s: List[str]
    :rtype: None Do not return anything, modify s in-place instead.
    """
    # Write your code here
    pass

# Do not modify below this line
if __name__ == "__main__":
    import sys
    import json
    s = json.loads(sys.stdin.readline().strip())
    result = reverseString(s)
    # Accept both in-place (return None) and return-value styles
    print(json.dumps(result if result is not None else s))`,

  java: `import java.util.*;
import java.io.*;

class Solution {
    public void reverseString(char[] s) {
        // Write your code here
    }
}

// Do not modify below this line
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine().trim();
        
        // Parse ["a","b","c"] format
        input = input.substring(1, input.length() - 1); // Remove [ ]
        String[] parts = input.split(",");
        char[] s = new char[parts.length];
        for (int i = 0; i < parts.length; i++) {
            String cleaned = parts[i].trim().replace("\\"", "");
            s[i] = cleaned.charAt(0);
        }
        
        Solution solution = new Solution();
        solution.reverseString(s);
        
        System.out.print("[");
        for (int i = 0; i < s.length; i++) {
            System.out.print("\\"" + s[i] + "\\"");
            if (i < s.length - 1) System.out.print(",");
        }
        System.out.println("]");
    }
}`,

  cpp: `#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

class Solution {
public:
    void reverseString(vector<char>& s) {
        // Write your code here
    }
};

// Do not modify below this line
int main() {
    string line;
    getline(cin, line);
    
    // Parse ["a","b","c"] format
    vector<char> s;
    line = line.substr(1, line.length() - 2); // Remove [ ]
    stringstream ss(line);
    string token;
    while (getline(ss, token, ',')) {
        // Remove quotes and spaces
        for (char c : token) {
            if (c != '"' && c != ' ') {
                s.push_back(c);
                break;
            }
        }
    }
    
    Solution solution;
    solution.reverseString(s);
    
    cout << "[";
    for (int i = 0; i < s.size(); i++) {
        cout << "\\"" << s[i] << "\\"";
        if (i < s.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    
    return 0;
}`,
};
