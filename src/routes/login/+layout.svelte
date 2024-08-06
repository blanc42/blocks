<script lang="ts">
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  </script>
  
  <div class="flex h-full items-center justify-center bg-background">
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle><slot name="title" /></CardTitle>
        <CardDescription><slot name="description" /></CardDescription>
      </CardHeader>
      <CardContent>
        <slot />
      </CardContent>
    </Card>
  </div>