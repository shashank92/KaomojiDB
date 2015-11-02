% import json
% with open("json/kaomoji.json") as f:
%   kaomoji = json.load(f).setdefault(category, [])
% end

<!DOCTYPE html>
<head>
</head>
<body>
% for k in kaomoji:
<div>{{k}}</div>
% end
</body>
</html>