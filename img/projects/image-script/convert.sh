 #!/bin/bash 
for i in *; do 
  sips --resampleWidth 300 -s format jpeg $i --out $i-300.jpg;
  sips --resampleWidth 800 -s format jpeg $i --out $i-800.jpg;
  sips                     -s format jpeg $i --out $i.jpg;
done
